import { GraduationCap, Plus, Trash2 } from "lucide-react";
import React from "react";

const EducationForm = ({ data, onChange }) => {
  const addEducation = () => {
    const newEducation = {
      institution: "",
      degree: "",
      field: "",
      graduation_date: "",
      gpa: "",
    };
    onChange([...data, newEducation]);
  };
  const removeEducation = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };
  const updatedEducation = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Education
          </h3>
          <p className="text-sm text-gray-500">Add your educationn details</p>
        </div>
        <button
          onClick={addEducation}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
        >
          <Plus className="size-4" /> Add Education
        </button>
      </div>
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No education added yet</p>
          <p className="text-sm">Click "Add Educationn" to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((education, index) => (
            <div
              className="p-4 border border-gray-200 rounded-lg space-y-3"
              key={index}
            >
              <div className="flex justify-between items-start">
                <h4>Education #{index + 1}</h4>
                <button
                  onClick={() => removeEducation(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="size-4" />{" "}
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <input
                  value={education.institution || ""}
                  onChange={(e) =>
                    updatedEducation(index, "institution", e.target.value)
                  }
                  type="text"
                  placeholder="Institution Name"
                  className="px-3 py-2 tex-sm "
                />{" "}
                <input
                  value={education.degree || ""}
                  onChange={(e) =>
                    updatedEducation(index, "degree", e.target.value)
                  }
                  type="text"
                  placeholder="Degree"
                  className="px-3 py-2 tex-sm "
                />
                <input
                  value={education.field || ""}
                  onChange={(e) =>
                    updatedEducation(index, "field", e.target.value)
                  }
                  type="text"
                  placeholder="Field of study"
                  className="px-3 py-2 tex-sm"
                />{" "}
                <input
                  value={education.graduation_date || ""}
                  onChange={(e) =>
                    updatedEducation(index, "graduation_date", e.target.value)
                  }
                  type="month"
                  className="px-3 py-2 tex-sm rounded-lg"
                />{" "}
              </div>
              <input
                value={education.gpa || ""}
                onChange={(e) => updatedEducation(index, "gpa", e.target.value)}
                type="text"
                placeholder="GPA (optional)"
                className="px-3 py-2 tex-sm"
              />{" "}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EducationForm;