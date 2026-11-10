import React, { useState } from "react";
import { Plus, Sparkles, X } from "lucide-react";

const SkillsForm = ({ data, onChange }) => {
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (newSkill.trim() && !data.includes(newSkill.trim())) {
      onChange([...data, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (indexToRemove) => {
    onChange(data.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          Skills
        </h3>
        <p className="text-sm text-gray-500">
          Add the skills or technologies you’re familiar with
        </p>
      </div>

      {/* Input + Add button */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Enter a skill (e.g., React, Node.js, MongoDB)"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={addSkill}
          disabled={!newSkill.trim}
          className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors"
        >
          <Plus className="size-4" /> Add
        </button>
      </div>

      {/* Skill list */}
      {data?.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {data.map((skill, index) => (
            <span
              key={index}
              className="flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
            >
              {skill}
              <button
                onClick={() => removeSkill(index)}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                <X className="size-4" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <Sparkles className="w-10 h-10 mx-auto mb-2 text-gray-300" />
          <p>No Skill added yet.</p>
          <p className="txt-sm">Add your technical and soft skills above.</p>
        </div>
      )}
      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-sm text-blue-800">
          {" "}
          <strong>Tip:</strong> Add 8-12 relevant skills. Include both technical
          skills (programming langages, tools ) and soft skills
          (leadership.communication).
        </p>
      </div>
    </div>
  );
};

export default SkillsForm;