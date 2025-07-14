import { useState, useEffect } from "react";
import "./css/App.css";
import Header from "./components/Header";
import CourseSearch from "./components/CourseSearch";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

// Custom dot with invisible hover area and colored visible dot
function CustomDot({ cx, cy, payload, prof, color, onHover, onLeave }) {
  // Don't render if dot position is invalid
  if (cx === undefined || cy === undefined) return null;
  return (
    <g>
      {/* Invisible circle to increase hover sensitivity */}
      <circle
        cx={cx}
        cy={cy}
        r={10}
        fill="transparent"
        style={{ cursor: "pointer" }}
        onMouseEnter={() => onHover(prof, payload.name, payload[prof], cx, cy)}
        onMouseLeave={onLeave}
      />
      {/* Visible dot */}
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill={color}
        stroke="white"
        strokeWidth={2}
        pointerEvents="none"
      />
    </g>
  );
}

function App() {
  const [searchResults, setSearchResults] = useState([]);
  // Processed data grouped by professor and semester with averaged GPAs
  const [graphData, setGraphData] = useState([]);
  // Controls whether graph is shown
  const [hasSearched, setHasSearched] = useState(false);

  // States for tooltip details
  const [hoveredProf, setHoveredProf] = useState(null);
  const [hoveredSemester, setHoveredSemester] = useState(null);
  const [hoveredGPA, setHoveredGPA] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Colors for professor names on graph
  const colorPalette = [
    "#4f46e5", "#10b981", "#ef4444", "#f59e0b", "#3b82f6",
    "#8b5cf6", "#ec4899", "#14b8a6", "#6366f1", "#f43f5e"
  ];

  // When searchResults change, compute GPA averages per professor/semester
  useEffect(() => {
    // Temporary structure: { professor: { semester: [GPAs] } }
    const profSemMap = {};

    searchResults.forEach(course => {
      const semester = course.year;
      
      course.gpa.forEach((gpaValue, index) => {
        const instructor = course.instructor[index];
        if (typeof gpaValue === "number") { // Just to be sure
          if (!profSemMap[instructor]) profSemMap[instructor] = {};
          if (!profSemMap[instructor][semester]) profSemMap[instructor][semester] = [];
          profSemMap[instructor][semester].push(gpaValue);
        }
      });
    });

    // Calculate average GPA for each prof-sem pair
    const profMap = {};
    for (const [prof, semesters] of Object.entries(profSemMap)) {
      profMap[prof] = [];
      for (const [semester, gpas] of Object.entries(semesters)) {
        const avgGPA = gpas.reduce((sum, val) => sum + val, 0) / gpas.length;
        profMap[prof].push({ name: semester, value: avgGPA });
      }
    }

    setGraphData(profMap);
  }, [searchResults]);

  // Get sorted list of unique semesters across all professors
  const allSemesters = [
    ...new Set(Object.values(graphData).flat().map(d => d.name))
  ].sort();

  // Format chart data: one object per semester with professor → GPA mappings
  const chartData = allSemesters.map(semester => {
    const entry = { name: semester };
    for (const [prof, dataArr] of Object.entries(graphData)) {
      const match = dataArr.find(d => d.name === semester);
      entry[prof] = match ? match.value : null;
    }
    return entry;
  });

  // console.log(chartData) // For debugging

  return (
    <>
      {/* Top header */}
      <Header />
      {/* Search Bar */}
      <CourseSearch
        setSearchResults={setSearchResults}
        setHasSearched={setHasSearched}
      />
      
      {/* Show chart only after a search */}
      {hasSearched && (
        <div className="flex flex-col min-h-screen bg-white text-gray-800">
          <footer className="w-11/12 mx-auto bg-white border-t border-gray-200 p-6 mt-20">
            {Object.keys(graphData).length > 0 ? (
              <>
                <h2 className="text-xl font-semibold mb-4">GPA Distribution</h2>
                <div className="w-full h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 20, right: 20, bottom: 20, left: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" padding={{ left: 10, right: 10 }} />
                      <YAxis domain={[0, 4.0]} tickCount={9} />
                      <Tooltip
                        isAnimationActive={false}
                        allowEscapeViewBox={{ x: false, y: false }}
                        position={{ x: tooltipPos.x, y: tooltipPos.y }}
                        content={() => {
                          if (!hoveredProf) return null;
                          return (
                            <div
                              style={{
                                backgroundColor: "white",
                                border: "1px solid gray",
                                padding: 10,
                                borderRadius: 4,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                fontSize: 14,
                                pointerEvents: "none",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <p><strong>Semester:</strong> {hoveredSemester}</p>
                              <p><strong>Professor:</strong> {hoveredProf}</p>
                              <p><strong>Average GPA:</strong> {hoveredGPA?.toFixed(3)}</p>
                            </div>
                          );
                        }}
                      />
                      {/* Chart legend shows professor names and colors */}
                      <Legend />
                      {Object.keys(graphData).map((prof, index) => (
                        <Line
                          key={prof}
                          type="monotone"
                          dataKey={prof}
                          name={prof}
                          stroke={colorPalette[index % colorPalette.length]}
                          strokeWidth={2}
                          // Render a custom dot for each data point
                          dot={(props) => {
                            const gpaValue = props.payload[prof];
                            if (gpaValue === null || gpaValue === undefined) return null; // Skip if no data
                            return (
                              <CustomDot
                                {...props}
                                prof={prof}
                                color={colorPalette[index % colorPalette.length]}
                                onHover={(p, semester, gpa, cx, cy) => {
                                  setHoveredProf(p);
                                  setHoveredSemester(semester);
                                  setHoveredGPA(gpa);
                                  setTooltipPos({ x: cx - 160, y: cy - 40 });
                                }}
                                // Reset tooltip state on mouse leave
                                onLeave={() => {
                                  setHoveredProf(null);
                                  setHoveredSemester(null);
                                  setHoveredGPA(null);
                                  setTooltipPos({ x: 0, y: 0 });
                                }}
                              />
                            );
                          }}
                          connectNulls
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            ) : (
              // If course data is not found
              <p className="text-center text-gray-600 mt-10">
                No results found.
              </p>
            )}
          </footer>
        </div>
      )}
    </>
  );
}

export default App;
