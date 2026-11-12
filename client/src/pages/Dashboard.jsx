import {
  FilePenLineIcon,
  LoaderCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloud,
  UploadCloudIcon,
  XIcon,
} from "lucide-react";
import { data, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
// import { dummyResumeData } from "../assets/assets";
import { useSelector } from "react-redux";
import api from "../config/api";
import toast from "react-hot-toast";
import pdfToText from "react-pdftotext";
import { setLoading } from "../app/features/authSlice";


const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth);

  const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"];

  const [showUploadResume, setShowUploadRusume] = useState(false);
  const [showCreateResume, setShowCreateRusume] = useState(false);
  const [title, setTitle] = useState("");
  const [resume, setResume] = useState(null);
  const [editResumeId, setEditResumeid] = useState("");
  const [allResumes, setAllResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const loadAllResumes = async () => {
    try {
      const { data } = await api.get("/api/users/resumes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(data);
      setAllResumes(data.resumes || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load resumes");
    }
  };

  // Create Resume API
  const createResume = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post(
        "/api/resumes/create",
        { title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAllResumes([...allResumes, data.resume]);
      setTitle("");
      setShowCreateRusume(false);
      navigate(`/app/builder/${data.resume._id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // Upload Resume (For now dummy redirect)
  const uploadResume = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const resumeText = await pdfToText(resume);
      const { data } = await api.post(
        `/api/ai/upload-resume`,
        { title, resumeText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle("");
      setResume(null);
      setShowUploadRusume(false);
      navigate(`/app/builder/${data.resumeId}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      setLoading(false);
    }
  };

  // Edit Resume Title (dummy for now)
  const editTitle = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put(
        `/api/resumes/update`,
        { resumeId: editResumeId, resumeData: { title } },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAllResumes(
        allResumes.map((resume) =>
          resume._id === editResumeId ? { ...resume, title } : resume
        )
      );
      setTitle("");
      setEditResumeid("");
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };
  const deleteResume = async (resumeId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resume?"
    );

    if (confirmDelete) {
      try {
        const { data } = await api.delete(
          `/api/resumes/delete/${resumeId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setAllResumes(allResumes.filter((resume) => resume._id !== resumeId));
        toast.success(data.message);
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message);
      }
    }
  };

  useEffect(() => {
    loadAllResumes();
  }, []);

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Heading */}
        <p className="text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden">
          Welcome, {user?.name || "User"}
        </p>

        {/* Create + Upload Cards */}
        <div className="flex gap-4">
          <button
            onClick={() => setShowCreateRusume(true)}
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <PlusIcon className="size-11 transition-all duration-300 p-2.5 bg-indigo-500 text-white rounded-full" />
            <p className="text-sm group-hover:text-indigo-600 transition-all">
              Create Resume
            </p>
          </button>

          <button
            onClick={() => setShowUploadRusume(true)}
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <UploadCloudIcon className="size-11 transition-all duration-300 p-2.5 bg-purple-500 text-white rounded-full" />
            <p className="text-sm group-hover:text-purple-600 transition-all">
              Upload Existing
            </p>
          </button>
        </div>

        <hr className="border-slate-300 my-6 sm:w-[305px]" />

        {/* Resume List */}
        <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
          {allResumes.map((resume, index) => {
            const baseColor = colors[index % colors.length];

            return (
              <button
                onClick={() => navigate(`/app/builder/${resume._id}`)}
                key={resume._id || index}
                className="relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`,
                  borderColor: baseColor + "40",
                }}
              >
                <FilePenLineIcon
                  className="size-7 group-hover:scale-105 transition-all"
                  style={{ color: baseColor }}
                />
                <p>{resume.title}</p>

                <p className="text-sm px-2 text-center">
                  Updated on {new Date(resume.updatedAt).toLocaleDateString()}
                </p>

                {/* Edit + Delete buttons */}
                <div
                  className="absolute top-1 right-1 hidden group-hover:flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <TrashIcon
                    onClick={() => deleteResume(resume._id)}
                    className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700"
                  />
                  <PencilIcon
                    onClick={() => {
                      setEditResumeid(resume._id);
                      setTitle(resume.title);
                    }}
                    className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700"
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* CREATE RESUME MODAL */}
        {showCreateResume && (
          <form
            onSubmit={createResume}
            className="fixed inset-0 bg-black/70 backdrop-blur z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2>Create a Resume</h2>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Enter resume title"
                className="w-full px-4 py-2 mb-4 border focus:border-green-600"
                required
              />

              <button className="w-full py-2 bg-green-600 text-white rounded">
                Create Resume
              </button>

              <XIcon
                className="absolute top-4 right-4 text-slate-400 cursor-pointer"
                onClick={() => {
                  setShowCreateRusume(false);
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}

        {/* UPLOAD RESUME MODAL */}
        {showUploadResume && (
          <form
            onSubmit={uploadResume}
            className="fixed inset-0 bg-black/70 backdrop-blur z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2>Upload Resume</h2>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Enter resume title"
                className="w-full px-4 py-2 mb-4 border"
                required
              />

              <label htmlFor="resume-input">
                <div className="flex flex-col items-center justify-center gap-2 border border-dashed rounded-md p-4 py-10 my-4 text-slate-400 hover:border-green-500 cursor-pointer">
                  {resume ? (
                    <p className="text-green-700">{resume.name}</p>
                  ) : (
                    <>
                      <UploadCloud className="size-14" />
                      <p>Upload resume</p>
                    </>
                  )}
                </div>
              </label>

              <input
                type="file"
                id="resume-input"
                accept=".pdf"
                hidden
                onChange={(e) => setResume(e.target.files[0])}
              />

              <button
                disabled={isLoading}
                className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2 "
              >
                {isLoading && (
                  <LoaderCircleIcon className="animate-spin size-4 text-white" />
                )}
                {isLoading ? "Uploading..." : "Upload resume"}
              </button>

              <XIcon
                className="absolute top-4 right-4 text-slate-400 cursor-pointer"
                onClick={() => {
                  setShowUploadRusume(false);
                  setTitle("");
                  setResume(null);
                }}
              />
            </div>
          </form>
        )}

        {/* EDIT TITLE MODAL */}
        {editResumeId && (
          <form
            onSubmit={editTitle}
            className="fixed inset-0 bg-black/70 backdrop-blur z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2>Edit Resume Title</h2>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Enter new title"
                className="w-full px-4 py-2 mb-4 border"
                required
              />

              <button className="w-full py-2 bg-green-600 text-white rounded">
                Update
              </button>

              <XIcon
                className="absolute top-4 right-4 text-slate-400 cursor-pointer"
                onClick={() => {
                  setEditResumeid("");
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Dashboard;