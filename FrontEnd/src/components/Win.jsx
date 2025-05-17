import React from "react";
import { useNavigate } from "react-router-dom";
import AnimatedContent from "./animations/AnimatedContent";

const Win = () => {
  const navigate = useNavigate();
  return (
    <div>
      <AnimatedContent
        distance={150}
        direction="vertical"
        reverse={false}
        config={{ tension: 80, friction: 20 }}
        initialOpacity={0.2}
        animateOpacity
        scale={1.1}
        threshold={0.2}
      >
        <div className="bg-gray-500/15 rounded-xl h-[50vh] flex items-center justify-center mt-32">
          <p className="font-rubik font-extrabold text-center px-32 text-9xl text-black text-transparent bg-gradient-to-r bg-clip-text from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
            YOU WIN!
          </p>
        </div>
      </AnimatedContent>
      <AnimatedContent
        distance={150}
        direction="vertical"
        delay={600}
        reverse={false}
        config={{ tension: 80, friction: 20 }}
        initialOpacity={0}
        animateOpacity
        scale={1.1}
        threshold={0.2}
      >
        <button
          onClick={() => navigate("/")}
          className="group w-auto bg-emerald-500 text-[#241909] font-bold py-6 px-32 mt-16 mx-25 rounded-lg shadow-2xl shadow-lg transition-all duration-300 hover:bg-emerald-600 hover:shadow-[0_8px_20px_rgba(16,185,129,0.4)] hover:scale-105"
        >
          Want to play again?
        </button>
      </AnimatedContent>
    </div>
  );
};

export default Win;
