import fs from 'fs'
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs"
import askAi from '../services/gemini.service.js'
import userModel from '../models/user.model.js'
import interviewModel from '../models/interview.model.js'

export const analyzeResume = async (req, res) => {
    try {
        if(!req.file){
            return res.status(400).json({
                message:"Resume required"
            })
        }

        const filePath = req.file.path
        const fileBuffer = await fs.promises.readFile(filePath)
        const uint8Array = new Uint8Array(fileBuffer)
        const pdf = await pdfjsLib.getDocument({data:uint8Array}).promise

        let resumeText = "";
        for(let pageNum = 1; pageNum <= pdf.numPages; pageNum++){
            const page = await pdf.getPage(pageNum)
            const content = await page.getTextContent();
            const pageText = content.items.map(item => item.str).join(" ")
            resumeText += pageText + "\n"
        }
        resumeText = resumeText.replace(/\s+/g, " ").trim()

        const messages = [
            {
                role:"system",
                content:`You are a Resume Parser. Extract data into JSON.
                STRICT RULES:
                    1. "role": Extract the most recent job title (e.g., 'Software Engineer').
                    2. "experience": Extract ONLY work history/internships. DO NOT include 'About Me' or 'Professional Summary' text here.
                    3. "projects": Return an array of ONLY the short project titles (max 5 words each).
                    4. "skills": Return an array of ONLY technical keywords 
                    Return ONLY valid JSON.`
            },
            {
                role: "user",
                content: resumeText
            }
        ]

        const aiResponse = await askAi(messages);
        const startQ = aiResponse.indexOf('{');
        const endQ = aiResponse.lastIndexOf('}') + 1;
        if (startQ === -1) throw new Error("AI failed to format questions correctly.");
        const cleanedQ = aiResponse.substring(startQ, endQ);
        const parsed = JSON.parse(cleanedQ);
       if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
       res.json({
            role: parsed.role || "",
            experience: parsed.experience || "",
            projects: parsed.projects || [],
            skills: parsed.skills || [],
            resumeText
        })
    } catch (error) {
        console.error(error)
        if(req.file && fs.existsSync(req.file.path)){
            fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({
            message: error.message
        })
    }
}
export const generateQuestion = async (req, res) => {
    try {
        let {role, experience, mode, resumeText, projects, skills} = req.body
        role = role?.trim()
        experience = experience?.trim()
        mode = mode?.trim()
        if(!role || !experience || !mode){
            return res.status(400).json({
                message: "Role, Experience and Mode are required."
            })
        }
        const user = await userModel.findById(req.userId)
        if(!user){
            return res.status(400).json({
                message:"User not found"
            })
        }
        if(user.credits < 50){
            return res.status(400).json({
                message:"Not enough credits. Minimun 50 required."
            }) 
        }

        const projectText = Array.isArray(projects) && projects.length ? projects.join(", ") : "None"
        const skillsText = Array.isArray(skills) && skills.length ? skills.join(", ") : "None"
        const safeResume = resumeText?.trim() || "None"
        const userPrompt = `
        Role:${role}
        Experience:${experience}
        InterviewMode:${mode}
        Projects:${projectText}
        Skills:${skillsText}
        Resume:${safeResume}`
        if(!userPrompt.trim()){
            return res.status(400).json({
                message:"Prompt content is empty."
            })
        }
        const messages = [
            {
                role: "system",
                content: `You are a professional interviewer. Generate exactly 5 technical interview questions.
                STRICT JSON RULE: Return ONLY a valid JSON object. 
                DO NOT include markdown backticks (e.g., \`\`\`json), DO NOT include introductory text, and DO NOT include any symbols.

                REQUIRED FORMAT: 
                {"questions": ["text1", "text2", "text3", "text4", "text5"]}

                RULES for "text":
                - Each string must be a full sentence (15-25 words).
                - No numbering or brackets inside the strings.
                - Difficulty curve: Q1-2 Easy, Q3-4 Medium, Q5 Hard.`
            },
            {
                role:"user",
                content:userPrompt
            }
        ]
        const aiResponse = await askAi(messages)
        const parsedData = JSON.parse(aiResponse)
        let rawQuestions = parsedData.questions || (Array.isArray(parsedData) ? parsedData : []);
        
        const questionsArray = rawQuestions
            .map(q => {
                const text = typeof q === 'string' ? q : q.question;
                return text ? text.replace(/[\[\]\{\}"']/g, "").trim() : "";
            })
            .filter(q => q.length > 15)
            .slice(0, 5);
        if (questionsArray.length < 5) {
            return res.status(500).json({
                message: "AI failed to generate enough valid questions. Please try again."
            })
        }
        user.credits -= 50;
        await user.save()
        const interview = await interviewModel.create({
            userId: user._id,
            role,
            experience,
            mode,
            resumeText:safeResume,
            questions: questionsArray.map((q, index) => ({
                question:q,
                difficulty:["easy","easy",'medium',"medium","hard"][index],
                timeLimit:[60,60,90,90,120][index]
            }))
        })
        res.json({
            interviewId:interview._id,
            creditsLeft: user.credits,
            username: user.name,
            questions: interview.questions
        })
    } catch (error) {
        return res.status(500).json({
           message:`Failed to create interview ${error.message}`
        })
    }
}

export const submitAnswer = async (req, res) => {
    try {
        const {interviewId, questionIndex, answer, timeTaken} = req.body
        const interview = await interviewModel.findById(interviewId)
        if (!interview) return res.status(404).json({ message: "Interview not found" })
        const question = interview.questions[questionIndex]
        if(!answer){
            question.score = 0;
            question.feedback = "You did not submit an answer.";
            question.answer = "";
            await interview.save();
            return res.json({ feedback:question.feedback})
        }
        if(timeTaken > question.timeLimit){
            question.score = 0;
            question.feedback = "Time limit exceeded. Answer not evaluated.";
            question.answer = answer;
             await interview.save()
             return res.json({feedback: question.feedback})
        }
        
        const messages = [
            {
                role: "system",
                content: `You are a professional interviewer. Evaluate the candidate's answer.
                Return ONLY a valid JSON object with these keys:
                {
                    "confidence": number,
                    "communication": number,
                    "correctness": number,
                    "finalScore": number,
                    "feedback": "short human feedback (10-15 words)"
                }`
            },
            {
                role: "user",
                content: `Question:${question.question}\nAnswer:${answer}`
            }
        ]

        const aiResponse = await askAi(messages)
        const start = aiResponse.indexOf('{');
        const end = aiResponse.lastIndexOf('}') + 1;
        if (start === -1) throw new Error("Invalid AI Evaluation Format");
        const cleanedResponse = aiResponse.substring(start, end);
        const parsed = JSON.parse(cleanedResponse);
        question.confidence = parsed.confidence
        question.communication = parsed.communication
        question.correctness = parsed.correctness
        question.score = parsed.finalScore
        question.feedback = parsed.feedback
        question.answer = answer
        await interview.save()
        return res.status(200).json({
            feedback:parsed.feedback
        })
    } catch (error) {
        return res.status(500).json({
            message:`Failed to submit answer ${error.message}`
        })
    }
}

export const finishInterview = async (req, res) => {
    try {
        const {interviewId} = req.body
        const interview = await interviewModel.findById(interviewId)
        if(!interview){ 
            return res.status(404).json({ message: "Interview not found in database." })
        }
        const totalQuestions = interview.questions.length
        let totalScore = 0
        let totalConfidence = 0
        let totalCommunication = 0
        let totalCorrectness = 0
        interview.questions.forEach(q => {
            totalScore += q.score || 0
            totalConfidence += q.confidence || 0
            totalCommunication += q.communication || 0
            totalCorrectness += q.correctness || 0
        })
        const finalScore = totalQuestions ? totalScore / totalQuestions : 0
        const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0
        const avgCommunication = totalQuestions ? totalCommunication / totalQuestions : 0
        const avgCorrectness = totalQuestions ? totalCorrectness / totalQuestions : 0
        interview.finalScore = finalScore
        interview.status = "Completed"
        await interview.save()
        return res.status(200).json({
            finalScore:Number(finalScore.toFixed(1)),
            confidence:Number(avgConfidence.toFixed(1)),
            communication:Number(avgCommunication.toFixed(1)),
            correctness:Number(avgCorrectness.toFixed(1)),
            questionWiseScore: interview.questions.map(q => ({
                question: q.question,
                score: q.score || 0,
                feedback: q.feedback || "",
                confidence: q.confidence || 0,
                communication: q.communication || 0,
                correctness: q.correctness || 0
            }))
        })
    } catch (error) {
        return res.status(500).json({
            message: `Failed to finish interview ${error.message}`
        })
    }
}

export const getMyInterviews = async (req, res) => {
    try {
        const interviews = await interviewModel.find({userId:req.userId}).select("role experience mode finalScore status createdAt")
        return res.status(200).json(interviews)
    } catch (error) {
        return res.status(500).json({
            message:`Failed to find currentUser Interview ${error.message}`
        })
    }
}

export const getInterviewReport = async (req, res) => {
    try {
        const interview =  await interviewModel.findById(req.params.id)
        if(!interview){
            return res.status(400).json({
                message : "Interview not found"
            })
        }
        const totalQuestions = interview.questions.length
        let totalConfidence = 0
        let totalCommunication = 0
        let totalCorrectness = 0
        interview.questions.forEach(q => {
            totalConfidence += q.confidence || 0
            totalCommunication += q.communication || 0
            totalCorrectness += q.correctness || 0
        })
        const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0
        const avgCommunication = totalQuestions ? totalCommunication / totalQuestions : 0
        const avgCorrectness = totalQuestions ? totalCorrectness / totalQuestions : 0
        
        return res.json({
            finalScore:interview.finalScore,
            confidence:Number(avgConfidence.toFixed(1)),
            communication:Number(avgCommunication.toFixed(1)),
            correctness:Number(avgCorrectness.toFixed(1)),
            questionWiseScore: interview.questions
        })
    } catch (error) {
        return res.status(500).json({message: `failed to find currentUser interview ${error.message}`})
    }
}

