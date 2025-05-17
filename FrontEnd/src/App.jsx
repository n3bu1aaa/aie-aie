import "./App.css";
import Win from "./components/Win";
import Level from "./components/Level";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Instructions from "./components/Instructions";
import { useEffect, useState } from "react";
import HandTracker from "./HandTracker";

export default function App() {
  const [inputList, setInputList] = useState([]);

  return (
    <div>
      {/* <HandTracker /> */}
      <Router>
        <div>
          <Routes>
            <Route path="/win" element={<Win />} />
            <Route path="/" element={<Home />} />
            <Route path="/level" element={<Level />} />
            <Route path="/instructions" element={<Instructions />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}
