chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.text) {
    fetchHistoricalContext(request.text);
  }
});

function fetchHistoricalContext(selectedText) {
  // Call an API or use a local database to get historical context
  fetch(
    `https://en.wikipedia.org/w/api.php?query=${encodeURIComponent(
      selectedText
    )}`
  )
    .then((response) => response.json())
    .then((data) => {
      displayContextOverlay(data);
    })
    .catch((error) => {
      console.error("Error fetching historical context:", error);
    });
}

function displayContextOverlay(data) {
  const overlay = document.createElement("div");
  overlay.className = "historical-context-overlay";
  overlay.innerHTML = `
    <div class="context-content">
      <h2>Historical Context</h2>
      <p>${data.description}</p>
      <ul>
        ${data.events.map((event) => `<li>${event}</li>`).join("")}
      </ul>
      <button id="close-overlay">Close</button>
    </div>
  `;
  document.body.appendChild(overlay);

  document.getElementById("close-overlay").addEventListener("click", () => {
    document.body.removeChild(overlay);
  });
}
