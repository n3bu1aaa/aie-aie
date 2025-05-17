import React, { useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import { drawHand } from "./Utilities";

const HandTracker = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runHandpose = async () => {
    const net = await handpose.load();
    console.log("Handpose model loaded.");
    
    // loop to detect hands
    setInterval(() => {
      detect(net);
    }, 100);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      // hand = hand predictions, array
      const hand = await net.estimateHands(video);
      console.log(hand);

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      const inputList = drawHand(hand, ctx);

      return inputList;
    }
  };

  runHandpose();

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          className="absolute top-0 left-0 w-full h-full rounded-xl"
          style={{ transform: "scaleX(-1)" }}
          videoConstraints={{
            width: 640,
            height: 480,
            facingMode: "user",
          }}
        />

        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="absolute left-0 right-0 mx-auto top-0 z-10 w-[640px] h-[480px] pointer-events-none"
        />
      </header>

      <div
        id="finger-cursor"
        className="fixed w-5 h-5 bg-green-500 rounded-full pointer-events-none z-50"
      />
    </div>
  );
};

export default HandTracker;
