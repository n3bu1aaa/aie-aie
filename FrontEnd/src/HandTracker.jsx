import React, { useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import { drawHand } from "./Utilities";

const HandTracker = ({ setInputList }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const runHandpose = async () => {
      await tf.ready();
      const net = await handpose.load();
      console.log("✅ Handpose model loaded");

      const detectLoop = () => {
        detect(net);
        requestAnimationFrame(detectLoop);
      };

      detectLoop();
    };

    runHandpose();
  }, []);

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const hand = await net.estimateHands(video);
      console.log(hand);

      const ctx = canvasRef.current.getContext("2d");
      const inputList = drawHand(hand, ctx);

      if (typeof setInputList === "function") {
        setInputList(inputList);
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: 200,
            height: 200,
            zIndex: 20,
          }}
        >
          <Webcam
            ref={webcamRef}
            className="rounded-xl"
            style={{
              width: "100%",
              height: "100%",
              transform: "scaleX(-1)",
              position: "absolute",
              top: 0,
              left: 0,
            }}
            videoConstraints={{
              width: 1000,
              height: 1000,
              facingMode: "user",
            }}
          />
          {/* to draw landmarks */}
          <canvas
            ref={canvasRef}
            width={200}
            height={200}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "none",
              width: "100%",
              height: "100%",
              zIndex: 10,
              border: "none",
            }}
          />
        </div>
      </header>
      {/* <div
    id="finger-cursor"
    className="fixed w-5 h-5 bg-green-500 rounded-full pointer-events-none z-50" 
    /> */}
    </div>
  );
};

export default HandTracker;
