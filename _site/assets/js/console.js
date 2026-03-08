const cBtn = document.getElementById("lang");

const consol = document.getElementById("cmd");
const banner = document.getElementById("banner");

const box = document.getElementById("cmd-box");

// cBtn.addEventListener('click', toggleConsole);
// cBtn.addEventListener("dblclick", toggleConsoleTwice);

let clickTimer = null;
const CLICK_DELAY = 500; // milliseconds

cBtn.addEventListener('click', function(e) {
  if (clickTimer === null) {
    clickTimer = setTimeout(() => {
      toggleConsole();
      clickTimer = null;
    }, CLICK_DELAY);
  }
});

cBtn.addEventListener('dblclick', function(e) {
  clearTimeout(clickTimer);
  clickTimer = null;
  toggleConsoleTwice();
});

// let cmdOpen = false;

let state = 0;
const labels = ["⇖", "✐", "⌫"]

function toggleConsole() {
  state = (state + 1) % 3;
  applyConsole();
}

function toggleConsoleTwice() {
  state = (state + 2) % 3;
  applyConsole();
}

function applyConsole() {
  cBtn.innerHTML = labels[state];
  if (state === 0) {
    clear();
    disableDrawing();
  }
  if (state === 1) {
    enableDrawing();
    setDrawMode();
  }
  if (state === 2) {
    enableDrawing();
    setEraseMode();
  }
}

document.addEventListener("DOMContentLoaded", applyConsole);

// draw

const canvas_draw = document.getElementById('drawCanvas');
let drawing = false;
let isErasing = false;
let ctx_draw = canvas_draw.getContext('2d');

function resizeCanvas() {
  canvas_draw.width = window.innerWidth;
  canvas_draw.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function getPointerPos(e) {
  // Support both touch and mouse
  if (e.touches) {
    return {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  }
  return {
    x: e.clientX,
    y: e.clientY
  };
}

// Drawing handlers
function startDrawing(e) {
  if (canvas_draw.style.display === 'none') return;
  drawing = true;
  const p = getPointerPos(e);
  ctx_draw.beginPath();
  ctx_draw.moveTo(p.x, p.y);
  ctx_draw.lineWidth = isErasing ? 20 : 3;
  
  if (isErasing) {
    ctx_draw.globalCompositeOperation = 'destination-out';
  } else {
    ctx_draw.globalCompositeOperation = 'source-over';
    ctx_draw.strokeStyle = "#5e69a6";
  }
  
  ctx_draw.lineCap = 'round';
  e.preventDefault();
}

function draw(e) {
  if (!drawing) return;
  const p = getPointerPos(e);
  ctx_draw.lineTo(p.x, p.y);
  ctx_draw.stroke();
  e.preventDefault();
}

function stopDrawing() {
  if (!drawing) return;
  drawing = false;
  ctx_draw.closePath();
}

// Enable drawing only when active
function enableDrawing() {
  canvas_draw.style.display = '';
  canvas_draw.style.pointerEvents = 'auto';
}

function disableDrawing() {
  canvas_draw.style.display = 'none';
  canvas_draw.style.pointerEvents = 'none';
}

// Set draw mode
function setDrawMode() {
  isErasing = false;
  canvas_draw.style.cursor = 'crosshair';
}

// Set erase mode
function setEraseMode() {
  isErasing = true;
  canvas_draw.style.cursor = 'grab';
}

let active = false;

function toggleDraw() {
  active = !active;
  if (active) enableDrawing();
  else disableDrawing();
}

function clear() {
    ctx_draw.clearRect(0, 0, canvas_draw.width, canvas_draw.height);
}

// Mouse events
canvas_draw.addEventListener('mousedown', startDrawing);
canvas_draw.addEventListener('mousemove', draw);
canvas_draw.addEventListener('mouseup', stopDrawing);
canvas_draw.addEventListener('mouseleave', stopDrawing);

// Touch events
canvas_draw.addEventListener('touchstart', startDrawing, {passive: false});
canvas_draw.addEventListener('touchmove', draw, {passive: false});
canvas_draw.addEventListener('touchend', stopDrawing);