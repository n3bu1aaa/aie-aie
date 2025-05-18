import React from "react";
import { useNavigate } from "react-router-dom";
import AnimatedContent from "./animations/AnimatedContent";

const Home = () => {
  const navigate = useNavigate();
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
            BLOOMTRACE
          </p>
        </AnimatedContent>
        <div className="flex items-center justify-center">
          <AnimatedContent
            distance={150}
            direction="horizontal"
            delay={600}
            reverse={true}
            config={{ tension: 80, friction: 20 }}
            initialOpacity={0}
            animateOpacity
            scale={1.1}
            threshold={0.2}
          >
            <button
              onClick={() => navigate("/instructions")}
              className="group w-auto bg-emerald-500 text-[#241909] font-bold py-6 px-32 mx-15 text-2xl rounded-lg shadow-2xl shadow-lg transition-all duration-300 hover:bg-emerald-600 hover:shadow-[0_8px_20px_rgba(16,185,129,0.4)] hover:scale-105"
            >
              Tutorial
            </button>
          </AnimatedContent>
          <AnimatedContent
            distance={150}
            direction="horizontal"
            delay={600}
            reverse={false}
            config={{ tension: 80, friction: 20 }}
            initialOpacity={0}
            animateOpacity
            scale={1.1}
            threshold={0.2}
          >
            <button
              onClick={() => navigate("/intro/1")}
              className="group w-auto bg-emerald-500 text-[#241909] font-bold py-6 px-32 mx-15 text-2xl rounded-lg shadow-2xl shadow-lg transition-all duration-300 hover:bg-emerald-600 hover:shadow-[0_8px_20px_rgba(16,185,129,0.4)] hover:scale-105"
            >
              Flowers
            </button>
          </AnimatedContent>
        </div>
      </div>
    </div>
  );
};

export default Home;
