const canvas = document.getElementById("radarCanvas");
const ctx = canvas.getContext("2d");
const selectEl = document.getElementById("dimensionSelect");
const sliderEl = document.getElementById("valueSlider");
const valueDisplay = document.getElementById("valueDisplay");
const downloadBtn = document.getElementById("downloadBtn");
const printBtn = document.getElementById("printBtn");

const RAD = Math.PI / 180;
const MAX_SCORE = 4;
const ringInnerRadius = 190;
const ringOuterRadius = 240;
const spiderRadius = 170;
const levelCount = 4;

const colorFamilies = {
  growth: { border: "#0f6a44", fill: "#b8dfca" },
  product: { border: "#f18f01", fill: "#ffddb5" },
  culture: { border: "#2b5f9e", fill: "#bfd3f0" },
  operations: { border: "#334155", fill: "#c9d2df" },
};

const segments = [
  { label: "Existing Business", family: "growth" },
  { label: "GTM", family: "growth" },
  { label: "Prod/Tech", family: "product" },
  { label: "Leadership/Ownership", family: "culture" },
  { label: "Talent/Culture", family: "culture" },
  { label: "Ops/Systems", family: "operations" },
  { label: "Financial Model", family: "operations" },
  { label: "New Business", family: "growth" },
];

const scores = [1.6, 2.4, 2.9, 3.2, 2.1, 1.4, 2.0, 3.6];
const arcSize = (2 * Math.PI) / segments.length;

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  const bigint = parseInt(normalized, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function rgbaFromHex(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function initControls() {
  segments.forEach((segment, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = segment.label;
    selectEl.appendChild(option);
  });

  selectEl.addEventListener("change", () => handleSelectionChange());
  sliderEl.addEventListener("input", (event) => handleSliderInput(event));
  downloadBtn.addEventListener("click", handleDownload);
  printBtn.addEventListener("click", handlePrint);

  selectEl.value = "0";
  updateSlider(0);
}

function handleSelectionChange() {
  const index = Number(selectEl.value);
  updateSlider(index);
}

function handleSliderInput(event) {
  const index = Number(selectEl.value);
  const value = Number(event.target.value);
  scores[index] = value;
  valueDisplay.textContent = value.toFixed(1);
  draw();
}

function updateSlider(index) {
  sliderEl.value = scores[index];
  valueDisplay.textContent = Number(scores[index]).toFixed(1);
}

function draw() {
  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.translate(width / 2, height / 2);

  drawRing();
  drawInnerSlices();
  drawSpiderGrid();
  drawData();
  drawLabels();

  ctx.restore();
}

function drawInnerSlices() {
  segments.forEach((segment, i) => {
    const startAngle = -90 * RAD + i * arcSize;
    const endAngle = startAngle + arcSize;
    const fillColor = rgbaFromHex(colorFamilies[segment.family].border, 0.12);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, spiderRadius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
  });
}

function drawRing() {
  segments.forEach((segment, i) => {
    const startAngle = -90 * RAD + (i * 2 * Math.PI) / segments.length;
    const endAngle = startAngle + (2 * Math.PI) / segments.length;
    const { border, fill } = colorFamilies[segment.family];

    ctx.beginPath();
    ctx.moveTo(
      Math.cos(startAngle) * ringOuterRadius,
      Math.sin(startAngle) * ringOuterRadius
    );
    ctx.arc(0, 0, ringOuterRadius, startAngle, endAngle);
    ctx.lineTo(
      Math.cos(endAngle) * ringInnerRadius,
      Math.sin(endAngle) * ringInnerRadius
    );
    ctx.arc(0, 0, ringInnerRadius, endAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = border;
    ctx.stroke();
  });
}

function drawSpiderGrid() {
  ctx.strokeStyle = "rgba(15, 32, 38, 0.3)";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 6]);

  for (let level = 1; level <= levelCount; level++) {
    const radius = (spiderRadius / levelCount) * level;
    ctx.beginPath();
    segments.forEach((_, i) => {
      const angle = -90 * RAD + (i * 2 * Math.PI) / segments.length;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.stroke();
  }

  ctx.setLineDash([]);
  segments.forEach((_, i) => {
    const angle = -90 * RAD + (i * 2 * Math.PI) / segments.length;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * spiderRadius, Math.sin(angle) * spiderRadius);
    ctx.stroke();
  });
}

function drawData() {
  ctx.beginPath();
  scores.forEach((value, i) => {
    const angle = -90 * RAD + (i * 2 * Math.PI) / segments.length;
    const radius = (value / MAX_SCORE) * spiderRadius;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = "rgba(126, 212, 231, 0.35)";
  ctx.strokeStyle = "#2c8aa3";
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();

  scores.forEach((value, i) => {
    const angle = -90 * RAD + (i * 2 * Math.PI) / segments.length;
    const radius = (value / MAX_SCORE) * spiderRadius;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    ctx.beginPath();
    ctx.fillStyle = "#2c8aa3";
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawLabels() {
  ctx.font = "17px 'Inter', sans-serif";
  ctx.fillStyle = "#0d1e24";

  const labelRadius = ringOuterRadius + 28;

  segments.forEach((segment, i) => {
    const midAngle = -90 * RAD + i * arcSize + arcSize / 2;
    const angleDeg = ((midAngle / RAD) + 360) % 360;
    const x = Math.cos(midAngle) * labelRadius;
    const y = Math.sin(midAngle) * labelRadius;

    let align = "center";
    if (angleDeg > 100 && angleDeg < 260) {
      align = "right";
    } else if (angleDeg < 80 || angleDeg > 280) {
      align = "left";
    }

    let baseline = "middle";
    if (angleDeg >= 30 && angleDeg <= 150) {
      baseline = "bottom";
    } else if (angleDeg >= 210 && angleDeg <= 330) {
      baseline = "top";
    }

    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    ctx.fillText(segment.label, x, y);
  });
}

function handleDownload() {
  const link = document.createElement("a");
  link.download = "client-readiness-radar.png";
  link.href = canvas.toDataURL("image/png", 1.0);
  link.click();
}

function handlePrint() {
  const imageData = canvas.toDataURL("image/png", 1.0);
  const printWindow = window.open("", "printWindow");
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>Client Readiness Radar</title>
        <style>
          body { margin: 0; display: flex; justify-content: center; align-items: center; }
          img { width: 90vw; max-width: 720px; }
        </style>
      </head>
      <body>
        <img src="${imageData}" alt="Client Readiness Radar" />
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

initControls();
draw();

