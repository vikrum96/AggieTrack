import React, { useState } from "react";

const CourseSearch = () => {
  const [major, setMajor] = useState("");
  const [number, setNumber] = useState("");

  const handleSearch = () => {
    console.log("Searching for", major, number);
    // Rest of the logic will go here
  }

  return (
    <div className="flex justify-center items-start mt-10 font-sans">
      {/* Course Major */}
      <div className="flex flex-col items-start mr-25">
        <label className="mb-1">Course Major (CSCE, MEEN, ENGR, etc.)</label>
        <input
          className="px-4 py-2 bg-gray-300 border-none rounded-xl text-base text-black w-32 text-left"
          type="text"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
        />
      </div>

      {/* Course Number */}
      <div className="flex flex-col items-start mr-7.5">
        <label className="mb-1">Course Number</label>
        <input
          className="px-4 py-2 bg-gray-300 border-none rounded-xl text-base text-black w-32 text-left"
          type="text"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
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
}

export default CourseSearch;


