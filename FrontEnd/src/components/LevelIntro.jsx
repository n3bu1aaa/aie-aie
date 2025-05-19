import React from "react";
import AnimatedContent from "./animations/AnimatedContent";
import { useNavigate, useParams } from "react-router-dom";
import { a } from "@react-spring/web";

const LevelIntro = () => {
  const navigate = useNavigate();
  const { levelId, accuracy } = useParams(); // 👈 Get level ID from URL
  return (
    <div className="flex items-center justify-center h-screen overflow-hidden">
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
          <p className="font-rubik font-extrabold text-center text-9xl text-black text-transparent bg-gradient-to-r bg-clip-text from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
            LEVEL {levelId}
          </p>
          <p>{accuracy == -1 ? "" : `Accuracy: ${accuracy}%`}</p>
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
            onClick={() => {
              navigate(`/level/${levelId}`);
            }}
            className="group w-auto bg-emerald-500 text-[#241909] font-bold text-xl py-6 px-32 mx-25 my-10 mb-8 rounded-lg shadow-2xl shadow-lg transition-all duration-300 hover:bg-emerald-600 hover:shadow-[0_8px_20px_rgba(16,185,129,0.4)] hover:scale-105"
          >
            Ready?
          </button>
        </AnimatedContent>
      </div>
    </div>
  );
};

export default LevelIntro;