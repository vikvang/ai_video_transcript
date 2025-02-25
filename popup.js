document.addEventListener("DOMContentLoaded", function () {
  const downloadBtn = document.getElementById("downloadBtn");
  const statusDiv = document.getElementById("status");

  downloadBtn.addEventListener("click", async function () {
    const totalCues = document.getElementById("totalCues").value;
    const delay = document.getElementById("delay").value;

    statusDiv.style.display = "block";
    statusDiv.textContent = "Processing transcript...";
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
        function: injectTranscriptDownloader,
        args: [parseInt(totalCues), parseInt(delay)],
      });

      statusDiv.textContent = "Transcript download initiated successfully!";
      statusDiv.style.backgroundColor = "#d4edda";
    } catch (error) {
      console.error(error);
      statusDiv.textContent = "Error: " + error.message;
      statusDiv.style.backgroundColor = "#f8d7da";
    }
  });

  // This function will be injected into the page
  function injectTranscriptDownloader(totalCues, delay) {
    async function loadAndCaptureTranscript() {
      let transcriptText = "";

      // First, try to find if there's a transcript container to determine max cues
      const containers = document.querySelectorAll('[id^="transcript-cue-"]');
      if (containers.length > 0 && containers.length > totalCues) {
        totalCues = containers.length;
        console.log(`Found ${totalCues} transcript cues on the page`);
      }

      for (let i = 0; i <= totalCues; i++) {
        let element = document.querySelector(`#transcript-cue-${i}`);
        if (element) {
          // Scroll the element into view
          element.scrollIntoView();
          await new Promise((resolve) => setTimeout(resolve, delay)); // Wait for it to load fully
          transcriptText += element.innerText + "\n";
        }
      }

      if (transcriptText) {
        console.log("Transcript captured successfully");
        let blob = new Blob([transcriptText], { type: "text/plain" });
        let link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "transcript.txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

        return true;
      } else {
        console.log("No transcript elements found.");
        alert(
          "No transcript elements found. Make sure you're on a page with a transcript."
        );
        return false;
      }
    }

    return loadAndCaptureTranscript();
  }
});
