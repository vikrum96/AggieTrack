import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
         <header className="flex items-center justify-between p-4 font-sans">
      
     
      <div className="pl-10 text-4xl">
        <h1 className="text-[#500000] font-[750]">Aggie Track</h1>
      </div>

     
      <div className="pr-5 flex items-center space-x-8">
        <a href="#">Favorites</a>
        <button className="bg-black hover:bg-gray-300 text-white rounded-md p-1 px-4">Dark Mode</button>
      </div>

    </header>

      <div />

      <div>Course Major</div>

      <form>
        <input />
      </form>

      <button>Search</button>
      

      <div />

      <div>Course Number</div>

      <form>
        <input />
      </form>

      <button>Search</button>
    </>
  );
}

export default App;
