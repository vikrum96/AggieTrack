import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <h1>Aggie Track</h1>
        <div>Favorites</div>
        <button>Dark Mode</button>
      </div>

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
