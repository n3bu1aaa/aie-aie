import { useRef, useEffect, useState, useMemo } from "react";
import "../App.css";

function Canvas() {
  let color_array = ["black", "blue", "green", "yellow", "orange"];
  let size_array = [2, 8, 16, 200];

  const canvasReference = useRef(null);
  const contextReference = useRef(null);
  const element = document.getElementById("myElement");

  const color = useMemo(() => [], []);

  let cheese = 0;
  let balls = 1;

  const clearCanvas = () => {
    const canvas = canvasReference.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  const setColor = (color) => {
    contextReference.current.strokeStyle = color;
    cheese += 1;

    if (cheese > 4) {
      cheese = 0;
    }
  };

  const eraser = () => {
    contextReference.current.strokeStyle = "white";
  };

  const setSize = (size) => {
    contextReference.current.lineWidth = size;
    balls += 1;
    if (balls > 3) {
      balls = 0;
    }
  };

  const [isPressed, setIsPressed] = useState(false);

  const beginDraw = (e) => {
    contextReference.current.beginPath();
    contextReference.current.moveTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );
    setIsPressed(true);
  };
  const updateDraw = (e) => {
    if (!isPressed) return;

    contextReference.current.lineTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );

    contextReference.current.stroke();
  };
  const endDraw = () => {
    contextReference.current.closePath();
    setIsPressed(false);
  };

  useEffect(() => {
    const canvas = canvasReference.current;
    canvas.width = 800;
    canvas.height = 800;

    const context = canvas.getContext("2d");
    context.linecap = "round";
    context.strokeStyle = color[0];
    context.lineWidth = balls;
    contextReference.current = context;
  }, [color]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "c" || e.key === "C") {
        clearCanvas();
      } else if (e.key === "o" || e.key === "O") {
        setColor(color_array[cheese]);
      } else if (e.key === "s" || e.key === "S") {
        setSize(size_array[balls]);
      } else if (e.key === "e" || e.key === "E") {
        eraser();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="Canvas" id="my_canvas">
      <canvas
        ref={canvasReference}
        onMouseDown={beginDraw}
        onMouseMove={updateDraw}
        onMouseUp={endDraw}
      />
    </div>
  );
}

export default Canvas;
