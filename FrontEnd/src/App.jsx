// import "./App.css";
// import Win from "./components/Win";
// import Level from "./components/Level";
// import { HashRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./components/Home";
// import { useEffect } from "react";

// function App() {
//   useEffect(() => {
//     document.title = "BloomTrace";
//   }, []);
//   return (
//     <Router>
//       <div>
//         <Routes>
//           <Route path="/win" element={<Win />} />
//           <Route path="/" element={<Home />} />
//           <Route path="/level" element={<Level />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }
// export default App;
import { useState, useEffect } from "react";
import HandTracker from "./HandTracker";

export default function App() {
  const [inputList, setInputList] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("inputList:", inputList);
    }, 1000);
    return () => clearInterval(interval);
  }, [inputList]);

  return (
    <div>
      {/* ✅ This is critical — must be setInputList, not inputList */}
      <HandTracker setInputList={setInputList} />
    </div>
  );
}
