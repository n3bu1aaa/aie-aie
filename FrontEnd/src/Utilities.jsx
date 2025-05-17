// return 1 if not together at all, hover when this happens
// return 2 if all but index together, for draw
// return 3 for index
// return 4 for middle
// return 5 for ring
// return 6 for pinky

const fingerTips = {
  Thumb: 4,
  indexFinger: 8,
  middleFinger: 12,
  ringFinger: 16,
  pinky: 20,
};

let prevPositions = [];
const CONFIRMATION_COUNT = 5;

export const drawHand = (predictions, ctx) => {
  if (predictions.length > 0) {
    let result = null;

    predictions.forEach((prediction) => {
      const landmarks = prediction.landmarks;

      const thumbX = landmarks[4][0];
      const thumbY = landmarks[4][1];

      let distanceToThumb = {};

      for (const finger in fingerTips) {
        const tipIndex = fingerTips[finger];

        if (tipIndex !== 4) {
          const dist = calculateDistance(
            thumbX,
            thumbY,
            landmarks[tipIndex][0],
            landmarks[tipIndex][1]
          );
          distanceToThumb[finger] = dist;
        }

        const x = landmarks[tipIndex][0];
        const y = landmarks[tipIndex][1];
        const invertedX = 640 / 2 - (x - 640 / 2);
        ctx.beginPath();
        ctx.arc(invertedX, y, 5, 0, 3 * Math.PI);
        ctx.fillStyle = "indigo";
        ctx.fill();
      }

      const selectedTips = [
        landmarks[fingerTips.Thumb],
        landmarks[fingerTips.indexFinger],
        landmarks[fingerTips.middleFinger],
        landmarks[fingerTips.ringFinger],
        landmarks[fingerTips.pinky],
      ];

      const together = areFingersTogether(selectedTips, 150, 50);

      if (together) {
        const confirmed = confirmPosition(2);
        if (confirmed) result = "Thumb, middle, ring, and pinky are together!";
      } else {
        let finger = null;
        let smallestValue = Infinity;

        for (const [key, value] of Object.entries(distanceToThumb)) {
          if (value < smallestValue) {
            smallestValue = value;
            finger = key;
          }
        }

        if (smallestValue <= 75) {
          const tipIndex = fingerTips[finger];
          const fingerTip = landmarks[tipIndex];

          const otherTips = Object.keys(fingerTips)
            .filter((f) => f !== finger && f !== "Thumb")
            .map((f) => landmarks[fingerTips[f]]);

          const isIsolated = isIsolatedFromOthers(fingerTip, otherTips, 50);

          if (isIsolated) {
            let confirmed;
            if (finger === "indexFinger") confirmed = confirmPosition(3);
            else if (finger === "middleFinger") confirmed = confirmPosition(4);
            else if (finger === "ringFinger") confirmed = confirmPosition(5);
            else if (finger === "pinky") confirmed = confirmPosition(6);

            if (confirmed) result = `${finger} is touching thumb`;
          }
        } else {
          const confirmed = confirmPosition(1);
          if (confirmed) result = "No fingers together.";
        }
      }
    });

    return result;
  }

  return null;
};


const calculateDistance = (x1, y1, x2, y2) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
};

const areFingersTogether = (tips, threshold, distFromIndex) => {
  // Check all tips are within the given threshold of each other
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
    if (i !== 1) { // skip index finger itself
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

    if (allSame) {
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
