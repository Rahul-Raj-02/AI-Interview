import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { serverURL } from "../App";
import Step3Report from "../components/Step3Report";

const InterviewReport = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const result = await axios.get(
          `${serverURL}/api/interview/report/${id}`,
          { withCredentials: true },
        );
        setReport(result.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchReport();
  }, [id]);

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading report...</p>
      </div>
    );
  }

  return <Step3Report report={report} />;
};

export default InterviewReport;
