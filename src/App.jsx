import { useState } from "react";
import "./css/App.css";
import Header from "./components/Header"
import CourseSearch from "./components/CourseSearch"

// Graph stuff
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'val1', value: 30 },
  { name: 'val2', value: 45 },
  { name: 'val3', value: 60 },
  { name: 'val4', value: 50 },
];

function App() {
  return (
    <>
      <Header />
      <CourseSearch />
      
      {/* Graph stuff */}
      <div className="flex flex-col min-h-screen bg-white text-gray-800">
        <footer className="w-1/2 ml-auto bg-white border-t border-gray-200 p-6 mt-20">
          <h2 className="text-xl font-semibold mb-4">Graph</h2>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;
