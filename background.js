chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "getContext",
    title: "Get Historical Context",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "getContext") {
    chrome.tabs.sendMessage(tab.id, { text: info.selectionText });
  }
});
