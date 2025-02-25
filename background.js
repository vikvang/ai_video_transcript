// Background script for Video Transcript Viewer extension
console.log("Video Transcript Viewer background script loaded");

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("Video Transcript Viewer extension installed");
});

// Context menu functionality
chrome.contextMenus.create({
  id: "showTranscript",
  title: "Show Video Transcript",
  contexts: ["page", "video"],
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "showTranscript") {
    chrome.tabs.sendMessage(tab.id, {
      action: "showTranscript",
      totalCues: 500, // Default to a higher number for context menu
      delay: 200,
    });
  }
});

// Listen for messages from the content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showTranscript") {
    // Forward the message to the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "showTranscript",
          totalCues: request.totalCues || 500,
          delay: request.delay || 200,
        });
      }
    });
    return true;
  }
});
