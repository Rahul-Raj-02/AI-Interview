import React, { useState, useRef, useEffect, useCallback } from "react";
import maleVideo from "../assets/videos/male-ai.mp4";
import femaleVideo from "../assets/videos/female-ai.mp4";
import Timer from "./Timer";
import { motion } from "motion/react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import axios from "axios";
import { serverURL } from "../App";
import { BsArrowRight } from "react-icons/bs";

const Step2Interview = ({ interviewData, onFinish }) => {
  const { interviewId, questions, username } = interviewData;
  const [isIntroPhase, setIsIntroPhase] = useState(true);
  const [isMicOn, setIsMicOn] = useState(false);
  const recognitionRef = useRef(null);
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitle, setSubtitle] = useState("");
  const videoRef = useRef(null);
  const currentQuestion = questions[currentIndex];

  const startMic = useCallback(() => {
    if (recognitionRef.current && !isAIPlaying) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.log("Speech recognition error:", err);
      }
    }
  }, [isAIPlaying]);

  const stopMic = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.log("Stop mic error:", err);
      }
    }
  }, []);

  const speakText = useCallback(
    (text) => {
      return new Promise((resolve) => {
        if (!window.speechSynthesis || !selectedVoice) {
          resolve();
          return;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(
          text.replace(/,/g, ",...").replace(/\./g, ". .."),
        );
        utterance.voice = selectedVoice;
        utterance.rate = 0.92;
        utterance.pitch = 0.98;
        utterance.volume = 1;
        utterance.onstart = () => {
          setIsAIPlaying(true);
          stopMic();
          videoRef.current?.play();
        };
        utterance.onend = () => {
          videoRef.current?.pause();
          if (videoRef.current) videoRef.current.currentTime = 0;
          setIsAIPlaying(false);
          if (isMicOn) startMic();
          setTimeout(() => {
            setSubtitle("");
            resolve();
          }, 300);
        };
        setSubtitle(text);
        window.speechSynthesis.speak(utterance);
      });
    },
    [selectedVoice, isMicOn, startMic, stopMic],
  );

  const finishInterview = useCallback(async () => {
    stopMic();
    setIsMicOn(false);
    try {
      const result = await axios.post(
        `${serverURL}/api/interview/finish`,
        {
          interviewId,
        },
        { withCredentials: true },
      );
      console.log(result.data);
      onFinish(result.data);
    } catch (error) {
      console.log("Error finishing interview:", error);
    }
  }, [interviewId, onFinish, stopMic]);

  const handleNext = useCallback(async () => {
    setAnswer("");
    setFeedback("");
    if (currentIndex + 1 >= questions.length) {
      finishInterview();
      return;
    }
    await speakText("Alright, let's move on to the next question.");
    setCurrentIndex(currentIndex + 1);
    setTimeout(() => {
      if (isMicOn) startMic();
    }, 500);
  }, [currentIndex, questions.length, finishInterview, speakText, isMicOn, startMic]);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      const femaleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("smantha") ||
          v.name.toLowerCase().includes("female"),
      );
      const maleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("mark") ||
          v.name.toLowerCase().includes("male"),
      );

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
      } else if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
      } else {
        setSelectedVoice(voices[0]);
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const hasSpokenIntro = useRef(false);
  const lastSpokenIndex = useRef(-1);

  useEffect(() => {
    if (!selectedVoice) return;
    const runIntro = async () => {
      if (isIntroPhase && !hasSpokenIntro.current) {
        hasSpokenIntro.current = true;
        await speakText(
          `Hi ${username}, it's great to meet you today. I hope you're feeling confident and ready.`,
        );
        await speakText(
          "I'll ask you a few questions. Just answer naturally, and take your time. Let's get started!",
        );
        setIsIntroPhase(false);
      } else if (!isIntroPhase && currentQuestion && lastSpokenIndex.current !== currentIndex) {
        lastSpokenIndex.current = currentIndex;
        await new Promise(r => setTimeout(r, 800));
        if (currentIndex === questions.length - 1) {
          await speakText("Alright, this one might be a bit more challenging.");
        }
        await speakText(currentQuestion.question);
      }
    };
    runIntro();
  }, [selectedVoice, isIntroPhase, currentIndex, currentQuestion, username, startMic, speakText, isMicOn, questions.length]);

  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;
    if (feedback) return;
    if(isAIPlaying) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isIntroPhase, currentIndex, feedback, currentQuestion, isAIPlaying]);

  useEffect(() => {
    if (!isIntroPhase && currentQuestion) {
      const t = setTimeout(() => {
         setTimeLeft(currentQuestion.timeLimit || 60);
      },0)
      return () => clearTimeout(t);
    }
  }, [currentIndex, isIntroPhase, currentQuestion]);

  useEffect(() => {
    if (!isIntroPhase && timeLeft === 0 && !isSubmitting && !feedback) {
      const autoTimeout = setTimeout(() => {
        handleNext();
      }, 100);
      return () => clearTimeout(autoTimeout);
    }
  }, [timeLeft, isIntroPhase, isSubmitting, feedback, handleNext]);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript.trim();
      setAnswer((prev) => prev + " " + transcript);
    };
    recognitionRef.current = recognition;
  }, []);

   useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const toggleMic = () => {
    if (isMicOn) {
      stopMic();
    } else {
      startMic();
    }
    setIsMicOn(!isMicOn);
  };

  const submitAnswer = async () => {
    if (isSubmitting) return;
    stopMic();
    setIsSubmitting(true);
    try {
      const result = await axios.post(
        `${serverURL}/api/interview/submit-answer`,
        {
          interviewId,
          questionIndex: currentIndex,
          answer,
          timeTaken: (currentQuestion.timeLimit || 60) - timeLeft,
        },
        { withCredentials: true },
      );
      setFeedback(result.data.feedback);
      speakText(result.data.feedback);
      setIsSubmitting(false);
    } catch (error) {
      console.log("Error submitting answer:", error);
      setIsSubmitting(false);
    }
  };

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-50 via-white to-cyan-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-350 min-h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col lg:flex-row overflow-hidden">
        <div className="w-full lg:w-[35%] bg-white flex flex-col items-center p-6 space-6 border-r border-gray-200">
          <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl">
            <video
              src={videoSource}
              key={videoSource}
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              className="w-full h-auto object-cover"
            />
          </div>

          {subtitle && (
            <div className="w-full max-w-md bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm mt-6">
              <p className="text-gray-700 text-sm sm:text-base font-medium text-center leading-relaxed">
                {subtitle}
              </p>
            </div>
          )}

          <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-md p-6 mt-6 space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-md text-gray-500">Interview Status</span>
              {isAIPlaying && (
                <span className="text-md font-semibold text-cyan-600">
                  {isAIPlaying ? "AI speaking..." : ""}
                </span>
              )}
            </div>
            <div className="h-px bg-gray-200"></div>
            <div className="flex justify-center">
              <Timer
                timeLeft={timeLeft}
                totalTime={currentQuestion?.timeLimit}
              />
            </div>
            <div className="h-px bg-gray-200"></div>
            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <span className="text-2xl font-bold text-cyan-600">
                  {currentIndex + 1}
                </span>
                <span className="text-sm text-gray-400">Current Questions</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-cyan-600">
                  {questions.length}
                </span>
                <span className="text-sm text-gray-400">Total Questions</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col p-4 sm:p-6 md-p-8 relative">
          <h2 className="text-xl sm:text-2xl font-bold text-cyan-600 mb-6">
            {" "}
            AI Smart interview{" "}
          </h2>
          {!isIntroPhase && (
            <div className="relative mb-6 bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-sm ms:text-md text-gray-400 mb-2">
                Question {currentIndex + 1} of {questions.length}
              </p>
              <div className="text-base sm:text-lg font-swmibold text-gray-800 leading-relaxed">
                {currentQuestion?.question}
              </div>
            </div>
          )}
          <textarea
            placeholder="Type your answer here..."
            onChange={(e) => setAnswer(e.target.value)}
            value={answer}
            className="flex-1 bg-gray-100 p-4 sm:p-6 rounded-2xl resize-none outline-none border border-gray-200 focus:ring-2 focus:ring-cyan-500 transition text-gray-800"
          />

          {!feedback ? (
            <div className="flex items-center gap-4  mt-6">
              <motion.button
                onClick={toggleMic}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-black text-white shadow-lg hover:cursor-pointer"
              >
                {isMicOn ? (
                  <FaMicrophone size={20} />
                ) : (
                  <FaMicrophoneSlash size={20} />
                )}
              </motion.button>

              <motion.button
                onClick={submitAnswer}
                disabled={isSubmitting}
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white py-3 sm:py-4 rounded-2xl shadow-lg hover:opacity-90 transition font-semibold disabled:bg-gray-500 hover:cursor-pointer"
              >
                {isSubmitting ? "Submitting..." : "Submit Answer"}{" "}
              </motion.button>
            </div>
          ) : (
            <motion.div 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mt-6 bg-cyan-100 p-5 rounded-2xl shadow-sm">
              <h3 className="text-cyan-500 font-bold text-sm mb-2 uppercase tracking-wider">AI Feedback</h3>
              <p className="text-cyan-700 font-medium mb-4">{feedback}</p>

              <motion.button
                onClick={handleNext}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-cyan-200 to-cyan-400 text-gray-600 font-bold py-3 rounded-xl shadow-md hover:opacity-90 transistion hover:cursor-pointer flex items-center justify-center gap-1"
              >
                Next Question <BsArrowRight size={20} />
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step2Interview;