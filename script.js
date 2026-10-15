
"use strict";

// Fictional practice data.
// Replace these records with permitted, relevant data for your track.
const observations = [
  { hours: 1, score: 35 },
  { hours: 2, score: 42 },
  { hours: 3, score: 48 },
  { hours: 4, score: 55 },
  { hours: 5, score: 62 },
  { hours: 6, score: 68 },
  { hours: 7, score: 75 },
  { hours: 8, score: 81 },
  { hours: 9, score: 88 },
  { hours: 10, score: 93 }
];

const hoursInput = document.getElementById("hours");
const hoursOutput = document.getElementById("hoursOutput");
const estimateBtn = document.getElementById("estimateBtn");
const scoreOutput = document.getElementById("score");
const meterFill = document.getElementById("meterFill");
const resultMessage = document.getElementById("resultMessage");
const resultHours = document.getElementById("resultHours");
const dataRows = document.getElementById("dataRows");
const rowCount = document.getElementById("rowCount");

// Calculate a best-fit straight line: y = slope * x + intercept.
function calculateTrend(records) {
  const n = records.length;

  const meanX = records.reduce((sum, r) => sum + r.hours, 0) / n;
  const meanY = records.reduce((sum, r) => sum + r.score, 0) / n;

  const numerator = records.reduce(
    (sum, r) => sum + (r.hours - meanX) * (r.score - meanY),
    0
  );

  const denominator = records.reduce(
    (sum, r) => sum + (r.hours - meanX) ** 2,
    0
  );

  if (denominator === 0) {
    throw new Error("The dataset needs variation in study hours.");
  }

  const slope = numerator / denominator;
  const intercept = meanY - slope * meanX;

  return { slope, intercept };
}

const trend = calculateTrend(observations);

// Display the sample records in the table.
function renderTable() {
  rowCount.textContent = `${observations.length} records`;
  dataRows.replaceChildren();

  observations.forEach((record) => {
    const row = document.createElement("tr");

    const hoursCell = document.createElement("td");
    hoursCell.textContent = record.hours;

    const scoreCell = document.createElement("td");
    scoreCell.textContent = record.score;

    const barCell = document.createElement("td");
    const bar = document.createElement("span");
    bar.className = "bar";
    bar.style.width = `${record.score}%`;
    barCell.appendChild(bar);

    row.append(hoursCell, scoreCell, barCell);
    dataRows.appendChild(row);
  });
}

// Update the number shown beside the slider.
hoursInput.addEventListener("input", () => {
  hoursOutput.textContent = hoursInput.value;
});

// Calculate and display a result when the button is clicked.
estimateBtn.addEventListener("click", () => {
  const hours = Number(hoursInput.value);
  const rawScore = trend.slope * hours + trend.intercept;

  // Scores are displayed within the 0–100 range.
  const score = Math.max(0, Math.min(100, rawScore));
  const roundedScore = score.toFixed(1);

  scoreOutput.textContent = roundedScore;
  meterFill.style.width = `${score}%`;
  resultHours.textContent = `${hours} hours/day`;

  if (score >= 80) {
    resultMessage.textContent =
      "The sample trend gives a high estimated score. This is not a guarantee of actual performance.";
  } else if (score >= 60) {
    resultMessage.textContent =
      "The sample trend gives a middle-range estimated score. Actual outcomes depend on many factors.";
  } else {
    resultMessage.textContent =
      "The sample trend gives a lower estimated score. Use this only to explore how the example data behaves.";
  }
});

renderTable();
