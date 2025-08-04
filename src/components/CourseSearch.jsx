import React, { useState } from "react";

const CourseSearch = ({ setSearchResults, setHasSearched }) => {
  const [major, setMajor] = useState("");
  const [number, setNumber] = useState("");

  const handleSearch = async () => {
    const param = new URLSearchParams();
    if (major.trim()) param.append('dept_name', major.trim());
    if (number.trim()) param.append('course_num', number.trim());

    try {
      const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_BASE}/api/grades?${param}`);
      const data = await res.json();
      setSearchResults(data);
      if (setHasSearched) setHasSearched(true); // Notify parent App
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex justify-center items-start mt-10 font-sans">
      {/* Course Major */}
      <div className="flex flex-col items-start mr-10">
        <label className="mb-1">Course Major (CSCE, MEEN, ENGR, etc.)</label>
        <input
          className="px-4 py-2 bg-gray-300 border-none rounded-xl text-base text-black w-32 text-left"
          type="text"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Course Number */}
      <div className="flex flex-col items-start mr-10">
        <label className="mb-1">Course Number</label>
        <input
          className="px-4 py-2 bg-gray-300 border-none rounded-xl text-base text-black w-32 text-left"
          type="text"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Search Button */}
      <button
        className="mt-7 px-4 py-2 bg-black text-white font-bold rounded-lg cursor-pointer hover:opacity-80 active:opacity-50"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
};

export default CourseSearch;
