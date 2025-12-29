const cBtn = document.getElementById("lang");

const consol = document.getElementById("cmd");
const banner = document.getElementById("banner");

const box = document.getElementById("cmd-box");

cBtn.addEventListener('click', toggleConsole);

// let cmdOpen = false;

let state = 0;
const labels = ["⇖", "✐", "⌫"]

function toggleConsole() {
  state = (state + 1) % 3;
  applyConsole();
}

function applyConsole() {
  cBtn.innerHTML = labels[state];
  if (state === 1) {
    enableDrawing();
  } else {
    disableDrawing();
  }
  if (state === 2) {
    clear();
  }
}

document.addEventListener("DOMContentLoaded", applyConsole);

// box.addEventListener("keyup", handleCmd)

// function handleCmd(event) {
//     if (event.key === "Enter") {
//         parseCmd(box.value.trim());
//         box.value = "";
//     }
// }

// function parseCmd(text) {
//     text = text.trim().toLowerCase();
//     if (text === "draw") {
//         toggleDraw();
//         return;
//     }
//     if (text === "clear") {
//         clear();
//         return;
//     }
//     alert("Unrecognized command");
// } 


// draw

// const drawBtn = document.getElementById('toggleDrawBtn');
const canvas_draw = document.getElementById('drawCanvas');
let drawing = false;
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
  ctx_draw.lineWidth = 3;
  ctx_draw.strokeStyle = 'blue';
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