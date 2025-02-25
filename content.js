// This script is injected into web pages by the extension
console.log("Transcript Downloader content script loaded");

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "downloadTranscript") {
    loadAndCaptureTranscript(request.totalCues, request.delay)
      .then((result) => sendResponse({ success: result }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true; // Indicates async response
  }
});

// This function helps users set up the transcript settings on Vimeo
function setupVimeoTranscript() {
  // Try to find and click the settings button for the transcript
  const settingsButtons = Array.from(
    document.querySelectorAll("button")
  ).filter(
    (btn) =>
      btn.innerText.includes("Settings") ||
      btn.title.includes("Settings") ||
      btn.getAttribute("aria-label")?.includes("Settings")
  );

  if (settingsButtons.length > 0) {
    console.log("Found transcript settings button, clicking it...");
    settingsButtons[0].click();

    // Try to find and click the timestamp toggle
    setTimeout(() => {
      const timestampOptions = Array.from(
        document.querySelectorAll('button, input[type="checkbox"]')
      ).filter(
        (el) =>
          el.innerText?.includes("timestamp") ||
          el.getAttribute("aria-label")?.includes("timestamp") ||
          el.title?.includes("timestamp")
      );

      if (timestampOptions.length > 0) {
        console.log("Found timestamp option, toggling it...");
        timestampOptions[0].click();
      } else {
        console.log("Timestamp option not found, please toggle it manually");
      }
    }, 500);
  } else {
    console.log(
      "Transcript settings button not found, please open settings manually"
    );
  }
}

// The main function to load and capture the transcript
async function loadAndCaptureTranscript(totalCues = 237, delay = 200) {
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
    return false;
  }
}
