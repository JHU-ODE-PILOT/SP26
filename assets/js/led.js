const messages = [
    `Welcome to PILOT Learning website for Differential Equations (Spring 2026).`,
    `If you find any questions, please contact us via <a href='/SP26/contacts.html'>Contacts</a> tab.`,
    `Often check out the <a href='https://jhu-ode-pilot.github.io/SP26/#announcements'>announcements</a> for the newest updates about PILOT.`,
    "There are a lot of useful resources located at the <a href='/SP26/resources.html'>Resources</a> tab."
];

const ledMessage = document.querySelector('.led-message');
const tickerBox = document.querySelector('.led-ticker');
const speed = 60; // pixels per second

let idx = 0;

function showMessage(txt) {
    // Clear animation, padding
    ledMessage.style.animation = 'none';
    ledMessage.style.paddingLeft = '';
    ledMessage.innerHTML = txt;

    // Wait for next frame to measure
    requestAnimationFrame(() => {
    // Calculate widths
    const textWidth = ledMessage.offsetWidth;
    const boxWidth = tickerBox.offsetWidth;

    // Total distance to travel: text fully out of view at the left
    const distance = textWidth + boxWidth;
    // duration at fixed speed
    const duration = distance / speed; // seconds

    // Set padding to start text just off right
    ledMessage.style.paddingLeft = boxWidth + "px";
    // Set dynamic animation
    ledMessage.style.animation = `led-scroll ${duration}s linear 1`;

    // Queue the next message
    clearTimeout(ledMessage._scrollTimeout);
    ledMessage._scrollTimeout = setTimeout(() => {
        idx = (idx + 1) % messages.length;
        showMessage(messages[idx]);
    }, duration * 1000);
    });
}

showMessage(messages[idx]);