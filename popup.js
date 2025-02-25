document.addEventListener("DOMContentLoaded", function () {
  const showBtn = document.getElementById("showBtn");
  const statusDiv = document.getElementById("status");

  showBtn.addEventListener("click", async function () {
    const totalCues = document.getElementById("totalCues").value;
    const delay = document.getElementById("delay").value;

    statusDiv.style.display = "block";
    statusDiv.textContent = "Showing transcript...";
    statusDiv.style.backgroundColor = "#e8f0fe";

    try {
      // Get the current active tab
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      // Execute the content script on the active tab
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: injectShowTranscript,
        args: [parseInt(totalCues), parseInt(delay)],
      });

      statusDiv.textContent = "Transcript viewer activated!";
      statusDiv.style.backgroundColor = "#d4edda";

      // Close the popup after a short delay
      setTimeout(() => window.close(), 1500);
    } catch (error) {
      console.error(error);
      statusDiv.textContent = "Error: " + error.message;
      statusDiv.style.backgroundColor = "#f8d7da";
    }
  });

  // This function will be injected into the page
  function injectShowTranscript(totalCues, delay) {
    // If there's a global function to show transcript, use it
    if (typeof findVideoAndShowTranscript === "function") {
      findVideoAndShowTranscript(totalCues, delay);
      return true;
    }

    // Otherwise, we'll trigger the content script via message
    chrome.runtime.sendMessage({
      action: "showTranscript",
      totalCues: totalCues,
      delay: delay,
    });

    return true;
  }
});
