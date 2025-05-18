import React from "react";
import AnimatedContent from "./animations/AnimatedContent";
import { useNavigate } from "react-router-dom";

const Instructions = () => {
  const navigate = useNavigate();
  return (
    <div>
      <AnimatedContent
        distance={150}
        direction="vertical"
        reverse={false}
        config={{ tension: 80, friction: 10 }}
        initialOpacity={0.2}
        animateOpacity
        scale={1.1}
        threshold={0.2}
      >
        <div className="bg-gray-500/10 rounded-xl px-6 py-8 mx-auto hover:scale-101 transition duration-300">
          <h1 className="font-rubik font-extrabold text-center text-4xl md:text-7xl text-transparent bg-gradient-to-r bg-clip-text from-indigo-500 via-sky-500 to-emerald-500 mb-5">
            Welcome to BloomTrace!
          </h1>

          <p className="text-left text-md md:text-2xl text-black leading-relaxed mx-6">
            BloomTrace is an expressive and therapeutic drawing experience
            designed with love and adaptability. Whether you're here to create,
            relax, or support your motor skills, BloomTrace empowers your hands
            and imagination.
          </p>

          <section className="mt-5">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">
              Customization Modes
            </h2>

            <div className="mb-6">
              <p className="font-bold">Parkinson’s Mode</p>
              <p>
                Lower sensitivity, forgiving brush control. Great for
                therapeutic use.
              </p>
            </div>

            <div className="mb-6">
              <p className="font-bold">Surgery/Precision Mode</p>
              <p>High sensitivity, detailed control for fine-tuned drawing.</p>
            </div>

            <div className="mb-6">
              <p className="font-bold">Hard Mode</p>
              <p>High challenge — full sensitivity for advanced users.</p>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">
              Hand Tracking Controls
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Toggle to draw:</strong> Thumb to pinky
              </li>
              <li>
                <strong>Change brush thickness:</strong> Thumb to ring finger
              </li>
              <li>
                <strong>Change brush colour:</strong> Thumb to middle finger
              </li>
              <li>
                <strong>Clear canvas:</strong> Thumb to index
              </li>
            </ul>
          </section>
        </div>
      </AnimatedContent>
      <AnimatedContent
        distance={10}
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
          className="group w-auto bg-sky-500 text-[#241909] font-bold py-3 px-16 mx-15 mt-5 text-2xl rounded-lg shadow-2xl shadow-lg transition-all duration-300 hover:bg-sky-600 hover:shadow-[0_8px_20px_rgba(16,185,129,0.4)] hover:scale-105"
        >
          Got it!
        </button>
      </AnimatedContent>
    </div>
  );
};

export default Instructions;
