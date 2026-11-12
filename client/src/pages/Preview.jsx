import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import { dummyResumeData } from "../assets/assets";
import { ArrowLeftIcon } from "lucide-react";
import ResumePreview from "../components/ResumePreview";
import Loader from "../components/Loader";
import api from "../config/api";

const Preview = () => {
  const { resumeId } = useParams();
  const [resumeData, setResumeData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  
  const loadResume = async () => {
    try {
      const { data } = await api.get("/api/resumes/public/" + resumeId);
      setResumeData(data.resume);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResume();
  }, [resumeId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader className="size-8 text-blue-500 animate-spin" />
        <p className="text-gray-500 mt-3">Loading resume...</p>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center space-y-4">
        <p className="text-gray-600 text-lg font-medium">Resume not found</p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-all duration-200"
        >
          <ArrowLeftIcon className="mr-2 size-4" />
          Go to Home Page
        </a>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="max-w-3xl mx-auto py-10">
        <ResumePreview
          data={resumeData}
          template={resumeData.template}
          accentColor={resumeData.accent_color}
          classes="py-4 bg-white rounded-xl shadow-md"
        />
      </div>
    </div>
  );
};

export default Preview