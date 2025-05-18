// return 1 if not together at all, hover when this happens
// return 2 if all but index together, for draw
// return 3 for index
// return 4 for middle
// return 5 for ring
// return 6 for pinky

let smoothedPosition = null;

const fingerTips = {
  Thumb: 4,
  indexFinger: 8,
  middleFinger: 12,
  ringFinger: 16,
  pinky: 20,
};

const fingerDraw = {
  Thumb: 4,
  middleFinger: 12,
  ringFinger: 16,
  pinky: 20,
};

let recentPositions = []; // Array of {x, y}
const MAX_POINTS = 12; //7

let prevPositions = []; // distances
const CONFIRMATION_COUNT = 4;

export const drawHand = (predictions, ctx) => {
  if (predictions.length === 0) return null;

  let currentGesture = null;
  let indexCoordinates = null;

  predictions.forEach((prediction) => {
    const landmarks = prediction.landmarks;
    const coords = drawIndex(landmarks[8], ctx);
    if (coords) indexCoordinates = coords;

    drawLandmarks(ctx, landmarks);

    const gesture = detectGesture(landmarks);
    if (gesture) currentGesture = gesture;
  });

  return [currentGesture, ...indexCoordinates];
};

const drawLandmarks = (ctx, landmarks) => {
  for (const finger in fingerDraw) {
    const tipIndex = fingerDraw[finger];
    const x = ctx.canvas.width - landmarks[tipIndex][0];
    const y = landmarks[tipIndex][1];

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 3 * Math.PI);
    ctx.fillStyle = "indigo";
    ctx.fill();
  }
};

const lerp = (a, b, t) => {
  return a + (b - a) * t;
};

const drawIndex = (indexLandmark, ctx) => {
  recentPositions.push({ x: indexLandmark[0], y: indexLandmark[1] });
  if (recentPositions.length > MAX_POINTS) {
    recentPositions.shift(); // Keep buffer small
  }

  const average = getAveragePosition(recentPositions);

  // Apply linear interpolation toward the average
  if (!smoothedPosition) {
    smoothedPosition = { ...average }; // Initialize on first frame
  } else {
    const smoothingFactor = 0.1; // Smaller = smoother, slower to update, p.15
    smoothedPosition.x = lerp(smoothedPosition.x, average.x, smoothingFactor);
    smoothedPosition.y = lerp(smoothedPosition.y, average.y, smoothingFactor);
  }

  const screenX = ctx.canvas.width - smoothedPosition.x;
  const screenY = smoothedPosition.y;

  ctx.beginPath();
  ctx.arc(screenX, screenY, 8, 0, 2 * Math.PI);
  ctx.fillStyle = "green";
  ctx.fill();

  // ⬇️ Move the fake HTML cursor
  const htmlCursor = document.getElementById("finger-cursor");
  const canvas = document.querySelector("canvas"); // Or drawCanvasRef.current if you're in React

  if (htmlCursor && canvas) {
    htmlCursor.style.left = `${screenX}px`;
    htmlCursor.style.top = `${screenY}px`;
  }

  return [screenX, screenY];
};

const detectGesture = (landmarks) => {
  const selectedTips = [
    landmarks[fingerTips.Thumb],
    landmarks[fingerTips.indexFinger],
    landmarks[fingerTips.middleFinger],
    landmarks[fingerTips.ringFinger],
    landmarks[fingerTips.pinky],
  ];

  const together = areFingersTogether(selectedTips, 250, 50);

  if (together) {
    const confirmed = confirmPosition(2);
    if (confirmed) return 2;
  } else {
    const distances = getDistancesToThumb(landmarks);
    const { finger, value } = findClosestFinger(distances);

    if (value <= 75) {
      const tipIndex = fingerTips[finger];
      const fingerTip = landmarks[tipIndex];

      const otherTips = Object.keys(fingerTips)
        .filter((f) => f !== finger && f !== "Thumb")
        .map((f) => landmarks[fingerTips[f]]);

      if (isIsolatedFromOthers(fingerTip, otherTips, 50)) {
        const gestureCode = {
          indexFinger: 3,
          middleFinger: 4,
          ringFinger: 5,
          pinky: 6,
        }[finger];

        const confirmed = confirmPosition(gestureCode);
        if (confirmed !== null) return gestureCode;
      }
    } else {
      const confirmed = confirmPosition(1);
      if (confirmed) return 1;
    }
  }

  return null;
};

const getDistancesToThumb = (landmarks) => {
  const distances = {};
  const thumbX = landmarks[fingerTips.Thumb][0];
  const thumbY = landmarks[fingerTips.Thumb][1];

  for (const finger in fingerTips) {
    if (finger === "Thumb") continue;
    const [x, y] = landmarks[fingerTips[finger]];
    distances[finger] = calculateDistance(thumbX, thumbY, x, y);
  }

  return distances;
};

function getAveragePosition(points) {
  const sum = points.reduce(
    (acc, p) => {
      acc.x += p.x;
      acc.y += p.y;
      return acc;
    },
    { x: 0, y: 0 }
  );

  return {
    x: sum.x / points.length,
    y: sum.y / points.length,
  };
}

const findClosestFinger = (distances) => {
  let smallestValue = Infinity;
  let finger = null;

  for (const [key, value] of Object.entries(distances)) {
    if (value < smallestValue) {
      smallestValue = value;
      finger = key;
    }
  }

  return { finger, value: smallestValue };
};

const calculateDistance = (x1, y1, x2, y2) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
};

const areFingersTogether = (tips, threshold, distFromIndex) => {
  // Check all tips are within the given threshold of each other

  for (let tip of tips) {
    if (!Array.isArray(tip) || tip.length < 2) return false;
  }

  for (let i = 0; i < tips.length; i++) {
    for (let j = i + 1; j < tips.length; j++) {
      const dist = calculateDistance(
        tips[i][0],
        tips[i][1],
        tips[j][0],
        tips[j][1]
      );
      if (dist > threshold) {
        return false;
      }
    }
  }

  //   Check if index finger (assumed to be tips[1]) is at least 100px away from all others
  const indexTip = tips[1]; // Assuming order: Thumb, Index, Middle, Ring, Pinky
  for (let i = 0; i < tips.length; i++) {
    if (i !== 1) {
      // skip index finger itself
      const dist = calculateDistance(
        indexTip[0],
        indexTip[1],
        tips[i][0],
        tips[i][1]
      );
      if (dist < distFromIndex) {
        return false; // Index too close
      }
    }
  }

  return true;
};

function confirmPosition(newPos) {
  // Add new position to history
  prevPositions.push(newPos);

  // Only keep last N positions
  if (prevPositions.length > CONFIRMATION_COUNT) {
    prevPositions.shift();
  }

  // Check if all positions are close to each other
  if (prevPositions.length === CONFIRMATION_COUNT) {
    const allSame = () => allIntegersSame(prevPositions);

    if (allSame()) {
      // Confirmed position
      return prevPositions[0];
    }
  }

  return null; // Not stable yet
}

const allIntegersSame = (arr) => {
  return arr.every((num) => num === arr[0]);
};

const isIsolatedFromOthers = (targetTip, otherTips, threshold = 50) => {
  return otherTips.every((tip) => {
    const dist = calculateDistance(targetTip[0], targetTip[1], tip[0], tip[1]);
    return dist > threshold;
  });
};
