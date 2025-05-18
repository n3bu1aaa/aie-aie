import React from "react";
import Canvas from "./Canvas.jsx";
import { useParams, useNavigate } from "react-router-dom"; // ✅ Import useParams
import Flower_1 from "../assets/Flower_images/Flower_1.svg";
import Flower_2 from "../assets/Flower_images/Flower_2.svg";
import Flower_3 from "../assets/Flower_images/Flower_3.svg";
import Flower_4 from "../assets/Flower_images/Flower_4.svg";
import Flower_5 from "../assets/Flower_images/Flower_5.svg";
import Flower_6 from "../assets/Flower_images/Flower_6.svg";
import Flower_7 from "../assets/Flower_images/Flower_7.svg";
import Flower_8 from "../assets/Flower_images/Flower_8.svg";
import Flower_9 from "../assets/Flower_images/Flower_9.svg";
import Flower_10 from "../assets/Flower_images/Flower_10.svg";
import Flower_12 from "../assets/Flower_images/Flower_12.svg";
import Flower_13 from "../assets/Flower_images/Flower_13.svg";
import Font_1 from "../assets/Fonts/Font_1.svg";
import Font_2 from "../assets/Fonts/Font_2.svg";
import Font_3 from "../assets/Fonts/Font_3.svg";
import Font_4 from "../assets/Fonts/Font_4.svg";
import Font_5 from "../assets/Fonts/Font_5.svg";
import Font_6 from "../assets/Fonts/Font_6.svg";
import Font_7 from "../assets/Fonts/Font_7.svg";
import Font_8 from "../assets/Fonts/Font_8.svg";
import Font_9 from "../assets/Fonts/Font_9.svg";
import Font_10 from "../assets/Fonts/Font_10.svg";
import Font_11 from "../assets/Fonts/Font_11.svg";
import Font_12 from "../assets/Fonts/Font_12.svg";
import { useState, useEffect } from "react";

let prevColor = 0;

const Level = () => {
  const navigate = useNavigate();
  const { levelId } = useParams(); // ✅ Get levelId from the URL
  const initialLevel = parseInt(levelId || "0", 10); // fallback to 0 if undefined

  const [isDrawing, setIsDrawing] = useState(false);

  const [level, setLevel] = useState(initialLevel); // ✅ Declare level state

  const colorOptions = ["#75B9BE", "#114B5F", "#EFC7C2", "#291720", "#820263"];
  const sizeOptions = [2, 8, 16, 50];

  const [colorIndex, setColorIndex] = useState(0);
  const [sizeIndex, setSizeIndex] = useState(0);

  const handleDoneClick = () => {
    const nextLevel = level + 1;
    setLevel(nextLevel);
    navigate(`/intro/${nextLevel}`);
  };

  const possibleImages = [
    Flower_1,
    Font_11,
    Flower_2,
    Flower_3,
    Flower_4,
    Font_3,
    Flower_5,
    Font_2,
    Flower_6,
    Font_9,
    Font_1,
    Flower_7,
    Font_4,
    Flower_8,
    Font_5,
    Font_8,
    Flower_9,
    Flower_10,
    Font_6,
    Font_10,
    Flower_12,
    Flower_13,
    Font_7,
    Font_12,
  ];

  useEffect(() => {
    setLevel(parseInt(levelId || "0", 10));
  }, [levelId]);

  return (
    <div>
      <div className="flex items-center justify-center gap-8">
        <div>
          {colorOptions.map((color, index) => (
            <div
              key={index}
              className={`border-2 rounded-lg h-[120px] w-[200px] my-10 transition-transform duration-300 cursor-pointer ${
                index === colorIndex
                  ? "ring-4 ring-yellow-400 scale-110 shadow-xl"
                  : ""
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setColorIndex(index)}
            />
          ))}
        </div>

        <div className="w-[800px] h-[800px]">
          <Canvas
            colorIndex={colorIndex}
            sizeIndex={sizeIndex}
            setColorIndex={setColorIndex}
            setSizeIndex={setSizeIndex}
            isDrawing={isDrawing}
            setIsDrawing={setIsDrawing}
            nextLevel={level}
            flowerImage={possibleImages[level - 1]}
            id="test_canvas"
            dpr={[1, 2]}
          />
        </div>
        <div>
          {sizeOptions.map((size, index) => (
            <div
              key={index}
              className={`border-2 rounded-lg h-[120px] w-[200px] my-10 flex flex-col items-center justify-center cursor-pointer transition-transform duration-300 ${
                index === sizeIndex
                  ? "ring-4 ring-blue-400 scale-110 shadow-xl"
                  : ""
              }`}
              onClick={() => setSizeIndex(index)}
            >
              <div
                className="bg-black rounded-full"
                style={{
                  width: `${
                    (-31 / 17136) * size * size * size +
                    (913 / 8568) * size * size -
                    (529 / 2142) * size +
                    8656 / 1071
                  }px`,
                  height: `${
                    (-31 / 17136) * size * size * size +
                    (913 / 8568) * size * size -
                    (529 / 2142) * size +
                    8656 / 1071
                  }px`,
                }}
              ></div>
              <p className="mt-8">Size {size}</p>
            </div>
          ))}
        </div>
        <button onClick={handleDoneClick} className="DownloadButton">
          Done?
        </button>
      </div>
    </div>
  );
};

export default Level;
