import { useRef, useEffect, useState } from "react";
import "../App.css";
import Flower from "../assets/Flower_images/Flower_1.svg";
import HandTracker from "../HandTracker";

function Canvas() {
  const drawCanvasRef = useRef(null);         // Madaya's draw here
  const overlayCanvasRef = useRef(null);      
  const hiddenCanvasRef = useRef(null);       
  const imageRef = useRef(null);
  const contextRef = useRef(null);

  const colorOptions = ["black", "blue", "green", "yellow", "orange"];
  const sizeOptions = [2, 8, 16, 200];

  const [colorIndex, setColorIndex] = useState(0);
  const [sizeIndex, setSizeIndex] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  useEffect(() => {
    const canvas = drawCanvasRef.current;
    canvas.width = 800;
    canvas.height = 800;

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.strokeStyle = colorOptions[colorIndex];
    ctx.lineWidth = sizeOptions[sizeIndex];
    contextRef.current = ctx;
  }, []);

  
  const drawReferenceImage = () => {
    const img = imageRef.current;

   
    const hiddenCtx = hiddenCanvasRef.current.getContext("2d");
    hiddenCtx.clearRect(0, 0, 800, 800);
    hiddenCtx.drawImage(img, 0, 0, 800, 800);

    
    const overlayCtx = overlayCanvasRef.current.getContext("2d");
    overlayCtx.clearRect(0, 0, 800, 800);
    overlayCtx.globalAlpha = 0.2;
    overlayCtx.drawImage(img, 0, 0, 800, 800);
    overlayCtx.globalAlpha = 1.0;
  };

  
  const startDraw = (e) => {
    contextRef.current.beginPath();
    contextRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    contextRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    contextRef.current.stroke();
  };

  const endDraw = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const ctx = drawCanvasRef.current.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 800, 800);
  };

  const calculateAccuracy = () => {
    const userCtx = drawCanvasRef.current.getContext("2d");
    const refCtx = hiddenCanvasRef.current.getContext("2d");

    const userData = userCtx.getImageData(0, 0, 800, 800).data;
    const refData = refCtx.getImageData(0, 0, 800, 800).data;

    let total = 0;
    let matched = 0;

    for (let i = 0; i < refData.length; i += 4) {
      const [r, g, b, a] = refData.slice(i, i + 4);
      if (a < 50 || (r + g + b) > 700) continue; 

      total++;

      const [ur, ug, ub, ua] = userData.slice(i, i + 4);
      const userBrightness = ur + ug + ub;
      if (ua > 50 && userBrightness < 700) matched++;
    }

    const accuracy = total === 0 ? 0 : ((matched / total) * 100).toFixed(2);
    alert(`Accuracy: ${accuracy}%`);
  };

  
  const handleKeyDown = (e) => {
    if (e.key === "c") clearCanvas();
    else if (e.key === "o") {
      const nextColor = (colorIndex + 1) % colorOptions.length;
      setColorIndex(nextColor);
      contextRef.current.strokeStyle = colorOptions[nextColor];
    } else if (e.key === "s") {
      const nextSize = (sizeIndex + 1) % sizeOptions.length;
      setSizeIndex(nextSize);
      contextRef.current.lineWidth = sizeOptions[nextSize];
    } else if (e.key === "e") {
      contextRef.current.strokeStyle = "white";
    } else if (e.key === "d") {
      calculateAccuracy();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  useEffect(() => {
    if (imageRef.current.complete) drawReferenceImage();
    else imageRef.current.onload = drawReferenceImage;
  }, []);

  return (
    <div style={{ position: "relative", width: 800, height: 800 }}>
     
      <canvas
        ref={overlayCanvasRef}
        width="800"
        height="800"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
          pointerEvents: "none"
        }}
      />

      
      <canvas
        ref={drawCanvasRef}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 2,
          border: "1px solid black"
        }}
      />

      
      <canvas
        ref={hiddenCanvasRef}
        width="800"
        height="800"
        style={{ display: "none" }}
      />

      
      <img
        ref={imageRef}
        src={Flower}
        alt="Reference"
        style={{ display: "none" }}
      />
    </div>
  );
}

export default Canvas;