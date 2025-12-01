const RAD = Math.PI / 180;
const geometry = {
  maxScore: 5,
  levels: 5,
  ringInnerRadius: 190,
  ringOuterRadius: 240,
  spiderRadius: 170,
  startAngle: -90 * RAD,
};

const colorFamilies = {
  growth: { border: "#0f6a44", fill: "#b8dfca" },
  product: { border: "#f18f01", fill: "#ffddb5" },
  culture: { border: "#2b5f9e", fill: "#bfd3f0" },
  operations: { border: "#334155", fill: "#c9d2df" },
};

const defaultSegments = [
  { label: "Existing Business", family: "growth" },
  { label: "GTM", family: "growth" },
  { label: "Prod/Tech", family: "product" },
  { label: "Leadership/Ownership", family: "culture" },
  { label: "Talent/Culture", family: "culture" },
  { label: "Ops/Systems", family: "operations" },
  { label: "Financial Model", family: "operations" },
  { label: "New Business", family: "growth" },
];

const defaultScores = [1.6, 2.4, 2.9, 3.2, 2.1, 1.4, 2.0, 3.6];

const datasetStyles = {
  single: {
    fill: "rgba(126, 212, 231, 0.35)",
    stroke: "#2c8aa3",
    point: "#2c8aa3",
  },
  custom: {
    fill: "rgba(42, 178, 138, 0.28)",
    stroke: "#0f6a44",
    point: "#0f6a44",
  },
  dualA: {
    fill: "rgba(42, 178, 138, 0.32)",
    stroke: "#0f6a44",
    point: "#0f6a44",
  },
  dualB: {
    fill: "rgba(241, 143, 1, 0.32)",
    stroke: "#f18f01",
    point: "#f18f01",
  },
};

setupNavigation();
createSingleChart();
createCustomChart();
createDualChart();

function setupNavigation() {
  const navButtons = document.querySelectorAll(".nav-btn");
  const pages = document.querySelectorAll(".page");
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.target;
      navButtons.forEach((node) => node.classList.remove("active"));
      btn.classList.add("active");
      pages.forEach((page) => {
        page.classList.toggle("page--active", page.id === target);
      });
    });
  });
}

function createSingleChart() {
  const canvas = document.getElementById("singleRadar");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const select = document.getElementById("singleDimensionSelect");
  const slider = document.getElementById("singleValueSlider");
  const valueDisplay = document.getElementById("singleValueDisplay");
  const downloadBtn = document.getElementById("singleDownloadBtn");
  const printBtn = document.getElementById("singlePrintBtn");

  const state = {
    segments: cloneSegments(defaultSegments),
    scores: [...defaultScores],
    selectedIndex: 0,
  };

  populateDimensionOptions(select, state.segments);
  updateSlider();

  select.addEventListener("change", () => {
    state.selectedIndex = Number(select.value);
    updateSlider();
  });

  slider.addEventListener("input", (event) => {
    const value = Number(event.target.value);
    state.scores[state.selectedIndex] = value;
    valueDisplay.textContent = value.toFixed(1);
    draw();
  });

  bindDownload(downloadBtn, canvas, "client-readiness-radar.png");
  bindPrint(printBtn, canvas, "Client Readiness Radar");

  draw();

  function updateSlider() {
    const score = state.scores[state.selectedIndex];
    slider.value = score;
    valueDisplay.textContent = score.toFixed(1);
  }

  function draw() {
    drawChart(ctx, state.segments, [{ scores: state.scores, style: datasetStyles.single }]);
  }
}

function createCustomChart() {
  const canvas = document.getElementById("customRadar");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const select = document.getElementById("customDimensionSelect");
  const slider = document.getElementById("customValueSlider");
  const valueDisplay = document.getElementById("customValueDisplay");
  const labelEditor = document.getElementById("customLabelEditor");
  const downloadBtn = document.getElementById("customDownloadBtn");
  const printBtn = document.getElementById("customPrintBtn");

  const state = {
    segments: cloneSegments(defaultSegments),
    scores: [...defaultScores],
    selectedIndex: 0,
  };

  populateDimensionOptions(select, state.segments);
  buildLabelEditor(labelEditor, state.segments, (index, newLabel) => {
    state.segments[index].label = newLabel || defaultSegments[index].label;
    populateDimensionOptions(select, state.segments);
    draw();
  });
  updateSlider();

  select.addEventListener("change", () => {
    state.selectedIndex = Number(select.value);
    updateSlider();
  });

  slider.addEventListener("input", (event) => {
    const value = Number(event.target.value);
    state.scores[state.selectedIndex] = value;
    valueDisplay.textContent = value.toFixed(1);
    draw();
  });

  bindDownload(downloadBtn, canvas, "custom-readiness-radar.png");
  bindPrint(printBtn, canvas, "Custom Radar");

  draw();

  function updateSlider() {
    const score = state.scores[state.selectedIndex];
    slider.value = score;
    valueDisplay.textContent = score.toFixed(1);
  }

  function draw() {
    drawChart(ctx, state.segments, [{ scores: state.scores, style: datasetStyles.custom }]);
  }
}

function createDualChart() {
  const canvas = document.getElementById("dualRadar");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const datasetSelect = document.getElementById("dualDatasetSelect");
  const dimensionSelect = document.getElementById("dualDimensionSelect");
  const slider = document.getElementById("dualValueSlider");
  const valueDisplay = document.getElementById("dualValueDisplay");
  const labelEditor = document.getElementById("dualLabelEditor");
  const downloadBtn = document.getElementById("dualDownloadBtn");
  const printBtn = document.getElementById("dualPrintBtn");

  const state = {
    segments: cloneSegments(defaultSegments),
    selectedIndex: 0,
    datasets: {
      current: { name: "Dataset A", scores: [...defaultScores] },
      target: {
        name: "Dataset B",
        scores: [3.4, 3.0, 2.4, 4.0, 3.2, 2.5, 2.2, 2.8],
      },
    },
  };

  populateDimensionOptions(dimensionSelect, state.segments);
  buildLabelEditor(labelEditor, state.segments, (index, newLabel) => {
    state.segments[index].label = newLabel || defaultSegments[index].label;
    populateDimensionOptions(dimensionSelect, state.segments);
    draw();
  });
  updateSlider();

  dimensionSelect.addEventListener("change", () => {
    state.selectedIndex = Number(dimensionSelect.value);
    updateSlider();
  });

  datasetSelect.addEventListener("change", () => {
    updateSlider();
  });

  slider.addEventListener("input", (event) => {
    const selectedDataset = state.datasets[datasetSelect.value];
    const value = Number(event.target.value);
    selectedDataset.scores[state.selectedIndex] = value;
    valueDisplay.textContent = value.toFixed(1);
    draw();
  });

  bindDownload(downloadBtn, canvas, "dual-readiness-radar.png");
  bindPrint(printBtn, canvas, "Dual Radar");

  draw();

  function updateSlider() {
    const selectedDataset = state.datasets[datasetSelect.value];
    const score = selectedDataset.scores[state.selectedIndex];
    slider.value = score;
    valueDisplay.textContent = score.toFixed(1);
  }

  function draw() {
    drawChart(ctx, state.segments, [
      { scores: state.datasets.current.scores, style: datasetStyles.dualA },
      { scores: state.datasets.target.scores, style: datasetStyles.dualB },
    ]);
  }
}

function drawChart(ctx, segments, datasets) {
  if (!ctx || !segments.length) return;
  const { canvas } = ctx;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);

  const arcSize = (2 * Math.PI) / segments.length;
  drawRing(ctx, segments, arcSize);
  drawInnerSlices(ctx, segments, arcSize);
  drawSpiderGrid(ctx, segments);
  datasets.forEach((dataset) => drawDataset(ctx, segments, arcSize, dataset));
  drawLabels(ctx, segments, arcSize);

  ctx.restore();
}

function drawRing(ctx, segments, arcSize) {
  segments.forEach((segment, i) => {
    const startAngle = geometry.startAngle + i * arcSize;
    const endAngle = startAngle + arcSize;
    const { border, fill } = colorFamilies[segment.family] || colorFamilies.growth;

    ctx.beginPath();
    ctx.moveTo(
      Math.cos(startAngle) * geometry.ringOuterRadius,
      Math.sin(startAngle) * geometry.ringOuterRadius
    );
    ctx.arc(0, 0, geometry.ringOuterRadius, startAngle, endAngle);
    ctx.lineTo(
      Math.cos(endAngle) * geometry.ringInnerRadius,
      Math.sin(endAngle) * geometry.ringInnerRadius
    );
    ctx.arc(0, 0, geometry.ringInnerRadius, endAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = border;
    ctx.stroke();
  });
}

function drawInnerSlices(ctx, segments, arcSize) {
  segments.forEach((segment, i) => {
    const startAngle = geometry.startAngle + i * arcSize;
    const endAngle = startAngle + arcSize;
    const palette = colorFamilies[segment.family] || colorFamilies.growth;
    const fillColor = rgbaFromHex(palette.border, 0.12);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, geometry.spiderRadius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
  });
}

function drawSpiderGrid(ctx, segments) {
  ctx.strokeStyle = "rgba(15, 32, 38, 0.3)";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 6]);
  const segmentCount = segments.length;

  for (let level = 1; level <= geometry.levels; level++) {
    const radius = (geometry.spiderRadius / geometry.levels) * level;
    ctx.beginPath();
    for (let i = 0; i < segmentCount; i++) {
      const angle = geometry.startAngle + (i * 2 * Math.PI) / segmentCount;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  ctx.setLineDash([]);
  for (let i = 0; i < segmentCount; i++) {
    const angle = geometry.startAngle + (i * 2 * Math.PI) / segmentCount;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * geometry.spiderRadius, Math.sin(angle) * geometry.spiderRadius);
    ctx.stroke();
  }
}

function drawDataset(ctx, segments, arcSize, dataset) {
  const { scores, style } = dataset;
  ctx.beginPath();
  scores.forEach((value, i) => {
    const angle = geometry.startAngle + i * arcSize;
    const radius = (value / geometry.maxScore) * geometry.spiderRadius;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = style.fill;
  ctx.strokeStyle = style.stroke;
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();

  scores.forEach((value, i) => {
    const angle = geometry.startAngle + i * arcSize;
    const radius = (value / geometry.maxScore) * geometry.spiderRadius;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    ctx.beginPath();
    ctx.fillStyle = style.point;
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawLabels(ctx, segments, arcSize) {
  ctx.font = "17px 'Inter', sans-serif";
  ctx.fillStyle = "#0d1e24";
  const labelRadius = geometry.ringOuterRadius + 32;

  segments.forEach((segment, i) => {
    const lineAngle = geometry.startAngle + i * arcSize;
    const angleDeg = ((lineAngle / RAD) + 360) % 360;
    const x = Math.cos(lineAngle) * labelRadius;
    const y = Math.sin(lineAngle) * labelRadius;

    let align = "center";
    if (angleDeg > 90 && angleDeg < 270) {
      align = "right";
    } else if (angleDeg < 90 || angleDeg > 270) {
      align = "left";
    }

    let baseline = "middle";
    if (angleDeg > 0 && angleDeg < 180) {
      baseline = "bottom";
    } else if (angleDeg > 180 && angleDeg < 360) {
      baseline = "top";
    }

    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    ctx.fillText(segment.label, x, y);
  });
}

function populateDimensionOptions(select, segments) {
  if (!select) return;
  const previousValue = select.value;
  select.innerHTML = "";
  segments.forEach((segment, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = segment.label;
    select.appendChild(option);
  });
  if (select.querySelector(`option[value="${previousValue}"]`)) {
    select.value = previousValue;
  } else {
    select.value = "0";
  }
}

function buildLabelEditor(container, segments, onChange) {
  if (!container) return;
  container.innerHTML = "";
  segments.forEach((segment, index) => {
    const field = document.createElement("div");
    field.className = "label-editor__field";
    const labelEl = document.createElement("label");
    const input = document.createElement("input");
    const inputId = `${container.id}-input-${index}`;

    labelEl.textContent = segment.label;
    labelEl.setAttribute("for", inputId);
    input.id = inputId;
    input.type = "text";
    input.value = segment.label;
    input.addEventListener("input", (event) => {
      const value = event.target.value.trim();
      labelEl.textContent = value || defaultSegments[index].label;
      onChange(index, value);
    });

    field.append(labelEl, input);
    container.appendChild(field);
  });
}

function bindDownload(button, canvas, filename) {
  if (!button) return;
  button.addEventListener("click", () => downloadCanvas(canvas, filename));
}

function bindPrint(button, canvas, title) {
  if (!button) return;
  button.addEventListener("click", () => printCanvas(canvas, title));
}

async function downloadCanvas(canvas, filename) {
  const canUsePicker =
    typeof window.showSaveFilePicker === "function" && window.isSecureContext;

  if (!canUsePicker) {
    triggerFallbackDownload(canvas, filename);
    return;
  }

  try {
    const blob = await canvasToBlob(canvas);
    const handle = await window.showSaveFilePicker({
      suggestedName: filename,
      types: [
        {
          description: "PNG Image",
          accept: { "image/png": [".png"] },
        },
      ],
    });
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
  } catch (error) {
    if (error?.name === "AbortError") {
      return;
    }
    console.error("Saving failed", error);
    triggerFallbackDownload(canvas, filename);
  }
}

function triggerFallbackDownload(canvas, filename) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png", 1.0);
  link.click();
}

function canvasToBlob(canvasEl) {
  return new Promise((resolve, reject) => {
    canvasEl.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Unable to export canvas to Blob."));
        }
      },
      "image/png",
      1.0
    );
  });
}

function printCanvas(canvas, title) {
  const imageData = canvas.toDataURL("image/png", 1.0);
  const printWindow = window.open("", "printWindow");
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { margin: 0; display: flex; justify-content: center; align-items: center; }
          img { width: 90vw; max-width: 720px; }
        </style>
      </head>
      <body>
        <img src="${imageData}" alt="${title}" />
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

function cloneSegments(list) {
  return list.map((segment) => ({ ...segment }));
}

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

