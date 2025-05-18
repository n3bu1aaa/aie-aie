import { useRef, useEffect, useState } from "react";
import "../App.css";
import HandTracker from "../HandTracker";

let lastX = 0;
let lastY = 0;
let noot = () => flip();

function Canvas({
  colorIndex,
  sizeIndex,
  setColorIndex,
  setSizeIndex,
  isDrawing,
  setIsDrawing,
  nextLevel,
  flowerImage,
}) {
  const drawCanvasRef = useRef(null); // Madaya's draw here
  const overlayCanvasRef = useRef(null);
  const hiddenCanvasRef = useRef(null);
  const imageRef = useRef(null);
  const contextRef = useRef(null);
  const prevGesture = useRef(null);

  const colorOptions = ["#75B9BE", "#114B5F", "#EFC7C2", "#291720", "#820263"];
  const sizeOptions = [10, 8, 16, 50];
  const [inputList, setInputList] = useState([]);
  const [toggleCooldown, setToggleCooldown] = useState(false);

  const cooldownDuration = 1000; // 1 second cooldown

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

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.lineWidth = sizeOptions[sizeIndex];
      contextRef.current.strokeStyle = colorOptions[colorIndex];
    }
  }, [colorIndex, sizeIndex]);

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

  // const startDraw = (e) => {
  //   if (!Array.isArray(inputList) || inputList[0] === 2) return;
  //   contextRef.current.beginPath();
  //   contextRef.current.moveTo(inputList[1], inputList[2]);
  //   setIsDrawing(true);
  // };

  // const draw = (e) => {
  //   contextRef.current.lineTo(inputList[1], inputList[2]);
  //   contextRef.current.stroke();
  // };

  // const endDraw = () => {
  //   if (inputList[0] === 2) return;
  //   contextRef.current.closePath();
  //   setIsDrawing(false);
  // };

  const clearCanvas = () => {
    const ctx = drawCanvasRef.current.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 800, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "d") {
      calculateAccuracy();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const calculateAccuracy = () => {
    const userCtx = drawCanvasRef.current.getContext("2d");
    const refCtx = hiddenCanvasRef.current.getContext("2d");

    const userData = userCtx.getImageData(0, 0, 800, 800).data;
    const refData = refCtx.getImageData(0, 0, 800, 800).data;

    let total = 0;
    let matched = 0;

    for (let i = 0; i < refData.length; i += 4) {
      const [r, g, b, a] = refData.slice(i, i + 4);
      if (a < 50 || r + g + b > 700) continue;

      total++;

      const [ur, ug, ub, ua] = userData.slice(i, i + 4);
      const userBrightness = ur + ug + ub;
      if (ua > 50 && userBrightness < 700) matched++;
    }

    const accuracy = total === 0 ? 0 : ((matched / total) * 100).toFixed(2);
    alert(`Accuracy: ${accuracy}%`);
  };

  const downloadCanvas = () => {
    const canvas = drawCanvasRef.current;
    const link = document.createElement("a");
    link.download = "my-drawing.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  useEffect(() => {
    if (Array.isArray(inputList) && inputList[0] === 3 && contextRef.current) {
      window.location.reload();
    }
  }, [inputList]);

  useEffect(() => {
    if (Array.isArray(inputList) && inputList[0] === 5 && contextRef.current) {
      const nextColor = (colorIndex + 1) % colorOptions.length;
      setColorIndex(nextColor);
      contextRef.current.strokeStyle = colorOptions[nextColor];
    }
  }, [inputList]);

  useEffect(() => {
    if (Array.isArray(inputList) && inputList[0] === 4 && contextRef.current) {
      const nextSize = (sizeIndex + 1) % sizeOptions.length;
      setSizeIndex(nextSize);
      contextRef.current.lineWidth = sizeOptions[nextSize];
    }
  }, [inputList]);

  // useEffect(() => {
  //   if (Array.isArray(inputList) && inputList[0] === 3 && contextRef.current) {
  //     contextRef.current.strokeStyle = "white";
  //   }
  // }, [inputList]);

  useEffect(() => {
    if (imageRef.current.complete) drawReferenceImage();
    else imageRef.current.onload = drawReferenceImage;
  }, []);

  // toggle
  useEffect(() => {
    if (!contextRef.current) return;
    if (!Array.isArray(inputList)) return;

    const [gesture, x, y] = inputList;

    if (gesture === 6 || isDrawing) {
      if (!isDrawing && gesture === 6) {
        contextRef.current.beginPath();
        contextRef.current.moveTo(x, y);
        setIsDrawing(true);
      } else {
        contextRef.current.lineTo(x, y);
        contextRef.current.stroke();
      }
    }
    if (isDrawing && gesture === 6) {
      contextRef.current.closePath();
      setIsDrawing(false);
    }
  }, [inputList]);

  //
  useEffect(() => {
    if (Array.isArray(inputList) && inputList[0] === 5 && contextRef.current) {
      console.log("in function");
      const currGesture = inputList[0];

      if (prevGesture.current !== currGesture) {
        console.log("next");
        const nextColor = (colorIndex + 1) % colorOptions.length;

        contextRef.current.strokeStyle = colorOptions[nextColor];
        setColorIndex(nextColor);

        prevGesture.current = currGesture;
      }
    } else {
      // Reset prevGesture when gesture changes to something else
      prevGesture.current = null;
    }
  }, [inputList]);

  useEffect(() => {
    if (Array.isArray(inputList) && inputList[0] === 4 && contextRef.current) {
      const currGesture = inputList[0];

      if (prevGesture.current !== currGesture) {
        const nextSize = (sizeIndex + 1) % sizeOptions.length;
        setSizeIndex(nextSize);
        contextRef.current.lineWidth = sizeOptions[nextSize];

        prevGesture.current = currGesture;
      }
    } else {
      // Reset prevGesture when gesture changes to something else
      prevGesture.current = null;
    }
  }, [inputList]);
  //

  // for cursor
  useEffect(() => {
    if (inputList?.[1]) lastX = inputList[1];
    if (inputList?.[2]) lastY = inputList[2];
  });

  return (
    <div style={{ position: "relative", width: 800, height: 800 }}>
      <HandTracker setInputList={setInputList} />
      <canvas
        ref={overlayCanvasRef}
        width="800"
        height="800"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <canvas
        ref={drawCanvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 2,
          border: "1px solid black",
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
        src={flowerImage}
        alt="Reference"
        style={{ display: "none" }}
      />

      <div
        id="finger-cursor"
        style={{
          position: "absolute",
          width: "20px",
          height: "20px",
          backgroundColor: "green",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 50,
          top: `${lastY}px`,
          left: `${lastX}px`,
          transition: "top 0.05s, left 0.05s",
        }}
      />

      <button
        onClick={downloadCanvas}
        style={{ marginTop: "820px" }}
        className="DownloadButton"
      >
        Download Drawing
      </button>
    </div>
  );
}

export default Canvas;
