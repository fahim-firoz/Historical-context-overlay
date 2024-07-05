console.log("Content script loaded");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received in content script:", request);
  if (request.action === "fetchHistoricalContext") {
    fetchHistoricalContext(request.text);
    sendResponse({ status: "received" });
  }
});

const PROXY_URL = "http://localhost:3000/proxy?url=";

function fetchHistoricalContext(selectedText) {
  const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(
    selectedText
  )}`;
  const fullUrl = PROXY_URL + encodeURIComponent(apiUrl);

  fetch(fullUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log("Data fetched:", data);
      if (data && data.query && data.query.pages) {
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];
        const extract = pages[pageId].extract;
        displayContextOverlay({ description: extract });
      } else {
        throw new Error("Invalid response format");
      }
    })
    .catch((error) => {
      console.error("Error fetching historical context:", error);
      displayErrorOverlay("Error fetching historical context.");
    });
}
function displayContextOverlay(context) {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "10px";
  overlay.style.right = "10px";
  overlay.style.padding = "10px";
  overlay.style.backgroundColor = "white";
  overlay.style.color = "black";
  overlay.style.border = "1px solid black";
  overlay.style.zIndex = 10000; // Ensure the overlay is on top of other elements
  overlay.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)"; // Add shadow for better visibility
  overlay.style.fontSize = "14px"; // Ensure the font size is readable
  overlay.style.maxWidth = "300px"; // Prevent the overlay from being too wide
  overlay.style.overflowY = "auto"; // Add scroll if content is too long

  const description = document.createElement("p");
  description.textContent = context.description;

  overlay.appendChild(description);
  document.body.appendChild(overlay);
}

function displayErrorOverlay(message) {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "10px";
  overlay.style.right = "10px";
  overlay.style.padding = "10px";
  overlay.style.backgroundColor = "red";
  overlay.style.color = "white";
  overlay.style.border = "1px solid black";
  overlay.style.zIndex = 10000; // Ensure the overlay is on top of other elements
  overlay.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)"; // Add shadow for better visibility
  overlay.style.fontSize = "14px"; // Ensure the font size is readable
  overlay.style.maxWidth = "300px"; // Prevent the overlay from being too wide
  overlay.style.overflowY = "auto"; // Add scroll if content is too long

  const errorMessage = document.createElement("p");
  errorMessage.textContent = message;

  overlay.appendChild(errorMessage);
  document.body.appendChild(overlay);
}
