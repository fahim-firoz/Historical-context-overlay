chrome.runtime.onInstalled.addListener(() => {
  console.log("Background script installed");

  chrome.contextMenus.create({
    id: "fetchContext",
    title: "Fetch Historical Context",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log("Context menu clicked", info, tab);
  if (info.menuItemId === "fetchContext") {
    console.log("Sending message to content script");
    chrome.tabs
      .sendMessage(tab.id, {
        action: "fetchHistoricalContext",
        text: info.selectionText,
      })
      .then((response) => {
        console.log("Message sent successfully", response);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  }
});
