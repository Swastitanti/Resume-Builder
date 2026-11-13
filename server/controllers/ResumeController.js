import Resume from "../models/Resume.js";
import fs from "fs";
import imageKit from "../configs/imageKit.js";


// controller for creating a new resume
// POST: /api/resumes/create
export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;
    console.log(title);

    // create new resume
    const newResume = await Resume.create({
      userId,
      title,
    });

    // return success message
    return res
      .status(201)
      .json({ message: "Resume created successfully", resume: newResume });

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


// controller for deleting a resume
// DELETE: /api/resumes/delete
export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;
    await Resume.findOneAndDelete({ userId, _id: resumeId });

    // return success message
    return res.status(200).json({ message: "Resume deleted successfully" });
    
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


// get user resume by id
// GET: /api/resumes/get
export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ userId, _id: resumeId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const resumeObj = resume.toObject();
    // delete resumeObj.__v;
    // delete resumeObj.createdAt;
    // delete resumeObj.updatedAt;

    resumeObj.__v = undefined;//my added
    resumeObj.createdAt = undefined;//my added
    resumeObj.updatedAt = undefined;//my added

    return res.status(200).json({ resume });// my added
    // return res.status(200).json({ resume: resumeObj });

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


// get resume by id public
// GET: /api/resumes/public
export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ public: true, _id: resumeId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({ resume });

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


// controller for updating a resume
// PUT: /api/resumes/update
export const updateResume = async (req, res) => {
  try {
    const userId = req.userId;

    // Get data from frontend
    const { resumeId, resumeData, removeBackground } = req.body;

    const image = req.file;

    // Validate required fields
    if (!resumeId || !resumeData) {
      return res.status(400).json({
        message: "Resume ID or resume data is missing",
      });
    }

    // Convert resumeData string into an object
    const resumeDataCopy =
      typeof resumeData === "string"
        ? JSON.parse(resumeData)
        : resumeData;

    // Upload image if provided
    if (image) {
      const imageBufferData = fs.createReadStream(image.path);

      const response = await imageKit.files.upload({
        file: imageBufferData,
        fileName: "resume.png",
        folder: "user-resume",
        transformation: {
          pre:
            "w-300,h-300,fo-face,z-0.75" +
            (removeBackground === "yes" ? ",e-bgremove" : ""),
        },
      });

      if (!resumeDataCopy.personal_info) {
        resumeDataCopy.personal_info = {};
      }

      resumeDataCopy.personal_info.image = response.url;
    }

    // Update resume in database
    const updated = await Resume.findOneAndUpdate(
      { userId, _id: resumeId },
      resumeDataCopy,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      message: "Resume saved successfully",
      resume: updated,
    });

  } catch (error) {
    console.error("Error updating resume:", error);

    return res.status(400).json({
      message: error.message,
    });
  }
};
