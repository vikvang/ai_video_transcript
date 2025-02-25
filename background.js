// Background script for Transcript Downloader extension
console.log("Transcript Downloader background script loaded");

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("Transcript Downloader extension installed");
});

// Context menu functionality - Optional enhancement
chrome.contextMenus.create({
  id: "downloadTranscript",
  title: "Download Transcript",
  contexts: ["page"],
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "downloadTranscript") {
    chrome.tabs.sendMessage(tab.id, {
      action: "downloadTranscript",
      totalCues: 500, // Default to a higher number for context menu
      delay: 200,
    });
  }
});
