import React from "react";
import Canvas from "./Canvas.jsx";
import Flower_1 from "../assets/Flower_images/Flower_1.svg";
import { useState } from "react";

const Level = () => {
  const colorOptions = ["#75B9BE", "#114B5F", "#EFC7C2", "#291720", "#820263"];
  const sizeOptions = [2, 8, 16, 50];

  const [colorIndex, setColorIndex] = useState(0);
  const [sizeIndex, setSizeIndex] = useState(0);
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
      </div>

      <img src={Flower_1} alt="" id="Flower_img" />
    </div>
  );
};

export default Level;
