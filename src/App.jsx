import { useState, useEffect } from "react";
import "./css/App.css";
import Header from "./components/Header";
import CourseSearch from "./components/CourseSearch";
import Graph from "./components/Graph";
import Table from "./components/Table";

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [graphData, setGraphData] = useState({});
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const profSemMap = {};
    searchResults.forEach(course => {
      const semester = course.year;
      course.gpa.forEach((gpaValue, index) => {
        const instructor = course.instructor[index];
        if (typeof gpaValue === "number") {
          if (!profSemMap[instructor]) profSemMap[instructor] = {};
          if (!profSemMap[instructor][semester]) profSemMap[instructor][semester] = [];
          profSemMap[instructor][semester].push(gpaValue);
        }
      });
    });

    const profMap = {};
    for (const [prof, semesters] of Object.entries(profSemMap)) {
      profMap[prof] = Object.entries(semesters).map(([semester, gpas]) => ({
        name: semester,
        value: gpas.reduce((sum, val) => sum + val, 0) / gpas.length,
      }));
    }
    setGraphData(profMap);
  }, [searchResults]);

  return (
    <>
      <Header />
      <CourseSearch
        setSearchResults={setSearchResults}
        setHasSearched={setHasSearched}
      />
      {hasSearched && (
        <div className="flex flex-col min-h-screen bg-white text-gray-800">
          <Graph graphData={graphData} />
          <Table searchResults={searchResults} />
        </div>
      )}
    </>
  );
}

export default App;
