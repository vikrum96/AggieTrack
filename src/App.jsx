import { useState } from "react";
import "./css/App.css";
import Header from "./components/Header"
import CourseSearch from "./components/CourseSearch"

function App() {
  return (
    <>
      <Header />
      <CourseSearch />
    </>
  );
}

export default App;
