// Save the original alert in case you ever need it
window._originalAlert = window.alert;

// Override the default alert
window.alert = function(message) {
  // Set the text in your custom modal
  document.getElementById("result-text").innerHTML = message || "";

  // Show the modal
  document.getElementById("result-modal").style.display = "flex";
};

// Handle close button
document.getElementById("close-modal-btn").onclick = function() {
  document.getElementById("result-modal").style.display = "none";
};