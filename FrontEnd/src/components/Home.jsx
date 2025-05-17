import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center h-screen overflow-hidden">
      <div>
        <p className="font-rubik font-extrabold text-center text-9xl text-black text-transparent bg-gradient-to-r bg-clip-text from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
          BLOOMTRACE
        </p>
        <button
          onClick={() => navigate("/level")}
          className="group w-auto bg-emerald-500 text-[#241909] font-bold py-6 px-32 mx-25 text-2xl rounded-lg shadow-2xl shadow-lg transition-all duration-300 hover:bg-emerald-600 hover:shadow-[0_8px_20px_rgba(16,185,129,0.4)] hover:scale-105"
        >
          Level 1
        </button>
      </div>
    </div>
  );
};

export default Home;
