     import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";


    const initializeHandDetection = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "/models/hand_landmarker.task",
          },
          numHands: 2,
          runningMode: "video",
        });
      } catch (error) {
        console.error("Error initializing hand detection:", error);
      }
    };

     const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        detectHands();
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    const detectHands = () => {
      if (
        handLandmarker &&
        videoRef.current &&
        videoRef.current.readyState >= 2
      ) {
        const detections = handLandmarker.detectForVideo(
          videoRef.current,
          performance.now()
        );
        // Process detections here
        requestAnimationFrame(detectHands);
      }
    };