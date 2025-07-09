import { useState, useEffect } from "react";
import "./css/App.css";
import Header from "./components/Header"
import CourseSearch from "./components/CourseSearch"

// Graph stuff
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    const data = [];

    searchResults.forEach(course => {
      const year = Array.isArray(course.year) ? course.year[0] : course.year;
      const dept = course.dept_name || "";
      const courseNum = course.course_num || "";

      if(Array.isArray(course.gpa)) {
        // Multiple GPAs
        course.gpa.forEach((gpaValue, index) => {
          if(typeof gpaValue === "number") {
            data.push({
              name: `${year || "Unknown"}`,
              value: gpaValue,
            });
          }
        });
      } else if(typeof course.gpa === "number") {
        // Single GPA value
        data.push({
          name: `${year || "Unknown"} ${dept}${courseNum}`,
          value: course.gpa,
        });
      }
    });

    setGraphData(data);
  }, [searchResults]);




  return (
    <>
      <Header />
      <CourseSearch setSearchResults={setSearchResults}/>
      
      {/* Graph stuff */}
      <div className="flex flex-col min-h-screen bg-white text-gray-800">
        <footer className="w-1/2 ml-auto bg-white border-t border-gray-200 p-6 mt-20">
          <h2 className="text-xl font-semibold mb-4">Graph</h2>
          <div className="w-full h-72">
            {graphData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graphData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
            ) : (
              <p>No data available to display.</p>
            )}
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;
