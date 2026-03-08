// --- Get DOM Elements ---
const urlParams = new URLSearchParams(window.location.search);
const url = urlParams.get('pdf');

const canvas = document.getElementById('pdf-render');
const ctx = canvas.getContext('2d');
const loadingMsg = document.getElementById('loading');

const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const pageNumDisplay = document.getElementById('page-num');
const pageCountDisplay = document.getElementById('page-count');
const textLayerDiv = document.querySelector('.textLayer');

const resultModal = document.getElementById('result-modal');
const resultText = document.getElementById('result-text');
const usrPassword = document.getElementById('usrPassword');
const enterBtn = document.getElementById('enter');

const downloadBtn = document.getElementById('download');
const ddlC = document.getElementById('ddl');

let isUnlock = false;

let passcode = localStorage.getItem(`pwd-${url}`) ?? "0";

// --- PDF.js Worker ---
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

document.getElementById('page-num').addEventListener("keydown", (event) => {
  if (event.key !== "Enter") {
    return;
  }
  const number = document.getElementById('page-num').value;
  renderPage(parseInt(number) ?? 0);
});

pageNumDisplay.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
      return;
    }
    const number = document.getElementById('page-num').value;
    renderPage(number);
  });

// --- State Variables ---
let pdfDoc = null;
let pageNum = Number(localStorage.getItem(`page-${url}`) ?? "1");
let pageCount = 0;
let scale = 3.0; // Default scale

// --- Modal Helpers ---
function showPasswordModal() {
  resultModal.style.display = "flex";
  usrPassword.value = "";
  usrPassword.focus();
}

function hidePasswordModal() {
  resultModal.style.display = "none";
}

// --- Page/UI Helpers ---
function checkPage() {
  nextBtn.disabled = pageNum >= pageCount;
  prevBtn.disabled = pageNum <= 1;
}

// --- Render PDF Page ---
function getResponsiveScale(originalPdfWidth) {
    const container = document.getElementById('pdf-viewer-container');
    const containerWidth = container.offsetWidth;
    return containerWidth / originalPdfWidth;
}

function renderPage(num) {
  pageNum = num % pageCount;
  if (pageNum <= 0) {
    pageNum += pageCount;
  }
  localStorage.setItem(`page-${url}`, pageNum.toString());
  loadingMsg.style.display = "block";

  pdfDoc.getPage(pageNum).then((page) => {
    let unscaledViewport = page.getViewport({ scale: 1 });
    let scale = getResponsiveScale(unscaledViewport.width);

    const viewport = page.getViewport({ scale: scale });
    const imgviewport = page.getViewport({ scale: scale * 3 });
    const textviewport = page.getViewport({ scale: scale });

    canvas.width = viewport.width * 3;
    canvas.height = viewport.height * 3;
    canvas.style.width = viewport.width + "px";
    canvas.style.height = viewport.height + "px";

    textLayerDiv.innerHTML = "";
    textLayerDiv.style.width = viewport.width + "px";
    textLayerDiv.style.height = viewport.height + "px";
    textLayerDiv.style.position = "absolute";
    textLayerDiv.style.top = "0";
    textLayerDiv.style.left = "0";
    textLayerDiv.style.setProperty('--scale-factor', viewport.scale);

    const renderContext = {
      canvasContext: ctx,
      viewport: imgviewport,
    };

    page.render(renderContext).promise.then(() => {
      loadingMsg.style.display = "none";
      pageNumDisplay.value = pageNum;
      textLayerDiv.innerHTML = "";
      checkPage();
      page.getTextContent().then(textContent => {
        pdfjsLib.renderTextLayer({
          textContent: textContent,
          container: textLayerDiv,
          viewport: textviewport,
          textDivs: [],
        });
      });
    });
  });
}

window.addEventListener('resize', () => {
    if (pdfDoc) renderPage(pageNum);
});

// --- PDF Loader (with password) ---
async function loadPdf(password) {
  let loadingTask = pdfjsLib.getDocument({
    url: url,
    password: password,
  });

  loadingTask.promise
    .then((doc) => {
      pdfDoc = doc;
      pageCount = doc.numPages;
      pageCountDisplay.textContent = pageCount;
      renderPage(pageNum);
      hidePasswordModal();
      isUnlock = true;
      checkPage();
      if (password) {
        localStorage.setItem(`pwd-${url}`, password.toString());
      }
    })
    .catch((err) => {
      // PDF.js error code 2 or PasswordException
      if (err && (err.code === 2 || err.name === "PasswordException")) {
        let msg = "Password required";
        if (err.message && err.message.includes("incorrect")) {
          msg = "Incorrect password. Try again:";
        }
        ddlC.style.display = 'none';
        if (!isUnlock) { showPasswordModal(); }
      } else {
        console.error("PDF load error:", err);
        loadingMsg.textContent = "Failed to load PDF.";
      }
    });
}

// --- Page Navigation ---
function queueRenderPage(num) {
  if (num >= 1 && num <= pageCount) {
    pageNum = num;
    renderPage(pageNum);
  }
  checkPage();
}

function nextPage() {
  if (pageNum < pageCount) {
    queueRenderPage(pageNum + 1);
  }
}

function prevPage() {
  if (pageNum > 1) {
    queueRenderPage(pageNum - 1);
  }
}

// --- Event Listeners ---
prevBtn.addEventListener("click", prevPage);
nextBtn.addEventListener("click", nextPage);

enterBtn.addEventListener("click", async () => {
  const pw = usrPassword.value + "0";
  loadingMsg.textContent = "Loading PDF ...";
  hidePasswordModal();
  await loadPdf(pw);
});

usrPassword.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    enterBtn.click();
  }
});

resultModal.style.display = "none";

// --- Initial PDF Load ---
document.addEventListener("DOMContentLoaded", async () => {
  if (!url) {
    loadingMsg.textContent = "Invalid URL.";
  } else {
    await loadPdf();
    await loadPdf(passcode);
  }
})

downloadBtn.addEventListener('click', function() {
    loadingMsg.textContent = "Preparing download...";
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.blob();
        })
        .then(blob => {
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = url.split('/').pop() || 'file.pdf';
            document.body.appendChild(a);

            // Programmatically click the link:
            a.click();

            // CLEAN UP
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
            loadingMsg.textContent = "";
        })
        .catch(err => {
            loadingMsg.textContent = "Failed to download PDF.";
            console.error("Download failed:", err);
        });
});

for (let i = 0; i <= 9; i++) {
  let numBtn = document.getElementById(i);
  numBtn.addEventListener('click', function() {
    usrPassword.value = usrPassword.value + i;
  })
}

const clearBtn = document.getElementById('clear');
clearBtn.addEventListener('click', function() {
  usrPassword.value = "";
})

document.addEventListener("keydown", (event) => {
  if (event.target === "input#page-num") {
    return;
  }
  if (event.key === "ArrowRight") {
    nextPage();
  } else if (event.key === "ArrowLeft") {
    prevPage();
  }
})