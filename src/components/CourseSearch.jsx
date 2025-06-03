import React, { useState } from "react";
import '../css/CourseSearch.css'

const CourseSearch = () => {
  const [major, setMajor] = useState("");
  const [number, setNumber] = useState("");

  const handleSearch = () => {
    console.log("Searching for", major, number);
    // Rest of the logic will go here
  }

  return (
    <div className="search-container">
      {/* Course Major */}
      <div className="field-group">
        <label>Course Major (CSCE, MEEN, ENGR, etc.)</label>
        <input className="input-field" type="text" value={major} onChange={(e) => setMajor(e.target.value)}/>
      </div>
      
      {/* Course Number */}
      <div className="field-group">
        <label>Course Number</label>
        <input className="input-field" type="text" value={number} onChange={(e) => setNumber(e.target.value)}/>
      </div>
      
      {/* Search Button */}
      <button className="search-button" onClick={handleSearch}>Search</button>
    </div>
  )
}

export default CourseSearch;


