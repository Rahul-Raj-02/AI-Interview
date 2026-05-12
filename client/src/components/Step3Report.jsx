import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Step3Report = ({ report }) => {
  const navigate = useNavigate();
  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    questionWiseScore = [],
  } = report;
  const questionScoreData = questionWiseScore.map((score, index) => ({
    name: `Q${index + 1}`,
    score: score.score || 0,
  }));
  const skills = [
    { label: "Confidence", value: confidence },
    { label: "Communication", value: communication },
    { label: "Correctness", value: correctness },
  ];
  let performanceText = "";
  let shortTagLine = "";
  if (finalScore >= 8) {
    performanceText = "Ready for job opportunity.";
    shortTagLine = "Work on clearity and confidence.";
  } else if (finalScore >= 5) {
    performanceText = "Need minor improvements before interviews.";
    shortTagLine = "Good foundation, refine articulation.";
  } else {
    performanceText = "Significant improvement required.";
    shortTagLine = "Work on clearity and confidence.";
  }
  const score = finalScore ? Number(Number(finalScore).toFixed(1)) : 0;
  const percentage = (score / 10) * 100 || 0;
  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let currentY = 25;
    // title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(49, 213, 246);
    doc.text("AI Interview Performance Report", pageWidth / 2, currentY, {
      align: "center",
    });
    currentY += 5;
    // underline
    doc.setDrawColor(78, 209, 252)
    doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);
    currentY += 15
    // final score box
    doc.setFillColor(192, 239, 244)
    doc.roundedRect(margin, currentY, contentWidth, 20, 4, 4, "F");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Final Score: ${finalScore}/10`, pageWidth / 2, currentY + 12, {
      align: "center",
    });
    currentY += 30;
    // skills box
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(margin, currentY, contentWidth, 30, 4, 4, "F");
    doc.setFontSize(12);
    doc.text(`Confidence: ${confidence}`, margin + 10, currentY + 10);
    doc.text(`Communication: ${communication}`, margin + 10, currentY + 18);
    doc.text(`Correctness: ${correctness}`, margin + 10, currentY + 26);
    currentY += 45;
    // advice
    let advice = "";
    if (finalScore >= 8) {
      advice =
        "Excellent performance. Maintain confidence and structure. Continue refining clarity and supporting answers with strong real-world examples.";
    } else if (finalScore >= 5) {
      advice =
        "Good foundation shown. Improve clarity and structure. Practice delivering concise, confident answers with stronger supporting examples.";
    } else {
      advice =
        "Significant improvement required. Focus on structured thinking, clarity, and confident delivery. Practice answering aloud regularly.";
    }
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(220);
    doc.roundedRect(margin, currentY, contentWidth, 35, 4, 4);
    doc.setFont("helvetica", "bold");
    doc.text("Professional Advice", margin + 10, currentY + 10);
    doc.setFont("helvetica", "normal")
    doc.setFontSize(11);
    const splitAdvice = doc.splitTextToSize(advice, contentWidth - 20);
    doc.text(splitAdvice, margin + 10, currentY + 20);
    currentY += 50;
    // question table
    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [["#", "Question", "Score", "Feedback"]],
      body: questionWiseScore.map((q, i) => [
        `${i + 1}`,
        q.question,
        `${q.score}/10`,
        q.feedback || "No Feedback provided",
      ]),
      styles: {
        fontSize: 9,
        cellPadding: 5,
        Valign: "top",
      },
      headStyles: {
        fillColor: [49, 213, 246],
        textColor: 255,
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        1: { cellWidth: 55 },
        2: { cellWidth: 20, halign: "center" },
        3: { cellWidth: "auto" },
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
    });
    doc.save("AI_Interview_Report.pdf")
  };

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading report...</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-cyan-100 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="md:mb-10 w-full flex items-start gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/history")}
            className="mt-1 p-3 rounded-full bg-white shadow hover:shadow-md transition hover:cursor-pointer"
          >
            <FaArrowLeft className="text-gray-600" />
          </motion.button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              Interview Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              AI-powered performance insights
            </p>
          </div>
        </div>
        <motion.button
          onClick={downloadPDF}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl shadow-md transition-all duration-300 font-semibold text-sm sm:text-base text-nowrap cursor-pointer"
        >
          Download PDF
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-6 rounded-2xl sm:rounded-3xl shadow-lg sm:p-8 text-center"
          >
            <h3 className="text-gray-500 mb-4 sm:mb-6 text-sm sm:textbase">
              Overall Performance
            </h3>
            <div className="relative w-20 h-20 sm:w-25 sm:h-25 mx-auto">
              <CircularProgressbar
                value={percentage}
                text={`${score}/10`}
                style={buildStyles({
                  textSize: "18px",
                  pathColor: "#46d7e7",
                  textColor: "#1e98a5",
                  trailColor: "#d6d6d6",
                })}
              />
            </div>

            <p className="text-gray-400 mt-3 text-xs sm:text-sm">Out of 10</p>
            <div className="mt-4">
              <p className="font-semibold text-gray-800 text-sm sm:text-base">
                {performanceText}
              </p>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                {shortTagLine}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8"
          >
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">
              Skill Breakdown
            </h3>
            <div className="space-y-5">
              {skills.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2 text-sm sm:text-base">
                    <span>{s.label}</span>
                    <span className="font-semibold text-cyan-600">
                      {s.value}/10
                    </span>
                  </div>
                  <div className="bg-gray-200 h-2 sm:h-3 rounded-full">
                    <div
                      className="bg-cyan-500 h-full rounded-full"
                      style={{ width: `${s.value * 10}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:col-span-2 space-y-6"
        >
          <motion.div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-8">
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-4 sm:mb-6">
              Performance Trend
            </h3>
            <div className="h-64 sm:h-72 ">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={questionScoreData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#229cc5"
                    fill="#229cc5"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-8"
          >
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-6">
              Question Breakdown
            </h3>
            <div className="space-y-6">
              {questionWiseScore.map((q, i) => (
                <div
                  key={i}
                  className="bg-gray-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-200"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                    <div className="">
                      <p className="text-xs text-gray-800 mb-2">
                        Question {i + 1}.
                      </p>
                      <p className="font-semibold text-gray-800 text-sm ms:text-base leading-relaxed">
                        {q.question || "Question not available"}
                      </p>
                    </div>
                    <div className="bg-cyan-100 text-cyan-600 px-3 py-1 rounded-full font-bold text-xs sm:text-sm w-fit">
                      {q.score ?? 0}/10
                    </div>
                  </div>
                  <div className="bg-cyan-50 border border-cyan-300 p-4 rounded-lg">
                    <p className="text-xs text-cyan-600 font-semibold mb-1">
                      AI Feedback
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {q.feedback && q.feedback.trim() !== ""
                        ? q.feedback
                        : "No feedback available for this question."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Step3Report;
