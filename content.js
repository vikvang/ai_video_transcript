// This script is injected into web pages by the extension
console.log("Video Transcript Viewer content script loaded");

// Store transcript data
let transcriptData = [];
let transcriptPanel = null;
let transcriptButton = null;
let hideTimestamps = false;
let videoElement = null;
let activeTimestamp = null;

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "showTranscript") {
    findVideoAndShowTranscript(request.totalCues, request.delay)
      .then((result) => sendResponse({ success: result }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true; // Indicates async response
  }
});

// Create a floating button to show transcript
function createTranscriptButton() {
  if (document.getElementById("transcript-button")) return;

  transcriptButton = document.createElement("button");
  transcriptButton.id = "transcript-button";
  transcriptButton.className = "transcript-button";
  transcriptButton.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><line x1="9" y1="10" x2="15" y2="10"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>';
  transcriptButton.title = "Show Transcript";

  transcriptButton.addEventListener("click", function () {
    if (transcriptPanel && document.body.contains(transcriptPanel)) {
      transcriptPanel.style.display =
        transcriptPanel.style.display === "none" ? "flex" : "none";
    } else {
      findVideoAndShowTranscript();
    }
  });

  document.body.appendChild(transcriptButton);
}

// Create the transcript panel UI
function createTranscriptPanel() {
  // Create panel if it doesn't exist
  if (transcriptPanel && document.body.contains(transcriptPanel)) {
    transcriptPanel.style.display = "flex";
    return transcriptPanel;
  }

  // Create the panel
  transcriptPanel = document.createElement("div");
  transcriptPanel.className = "transcript-panel";

  // Create header
  const header = document.createElement("div");
  header.className = "transcript-header";

  const title = document.createElement("h2");
  title.className = "transcript-title";
  title.textContent = "Transcript";

  const closeButton = document.createElement("button");
  closeButton.className = "transcript-close";
  closeButton.innerHTML = "✕";
  closeButton.addEventListener("click", function () {
    transcriptPanel.style.display = "none";
  });

  header.appendChild(title);
  header.appendChild(closeButton);

  // Create search
  const search = document.createElement("div");
  search.className = "transcript-search";

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search in transcript";
  searchInput.addEventListener("input", function () {
    filterTranscript(this.value);
  });

  search.appendChild(searchInput);

  // Create content container
  const content = document.createElement("div");
  content.className = "transcript-content";

  // Create settings
  const settings = document.createElement("div");
  settings.className = "transcript-settings";

  const timestampToggle = document.createElement("label");
  timestampToggle.className = "transcript-toggle";

  const timestampCheckbox = document.createElement("input");
  timestampCheckbox.type = "checkbox";
  timestampCheckbox.checked = !hideTimestamps;
  timestampCheckbox.addEventListener("change", function () {
    hideTimestamps = !this.checked;
    updateTranscriptDisplay();
  });

  timestampToggle.appendChild(timestampCheckbox);
  timestampToggle.appendChild(document.createTextNode("Show timestamps"));

  settings.appendChild(timestampToggle);

  // Assemble the panel
  transcriptPanel.appendChild(header);
  transcriptPanel.appendChild(search);
  transcriptPanel.appendChild(content);
  transcriptPanel.appendChild(settings);

  document.body.appendChild(transcriptPanel);

  return transcriptPanel;
}

// Format seconds to MM:SS format
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);
  return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
}

// Update transcript display based on current settings
function updateTranscriptDisplay() {
  if (!transcriptPanel) return;

  const content = transcriptPanel.querySelector(".transcript-content");
  content.innerHTML = "";

  transcriptData.forEach((cue) => {
    const cueElement = document.createElement("div");
    cueElement.className = "transcript-cue";
    cueElement.dataset.time = cue.time;

    if (cue.time === activeTimestamp) {
      cueElement.classList.add("active");
    }

    cueElement.addEventListener("click", function () {
      if (videoElement) {
        videoElement.currentTime = cue.time;
        videoElement.play();
      }
    });

    if (!hideTimestamps) {
      const timestamp = document.createElement("div");
      timestamp.className = "transcript-timestamp";
      timestamp.textContent = formatTime(cue.time);
      cueElement.appendChild(timestamp);
    }

    const text = document.createElement("div");
    text.className = "transcript-text";
    text.textContent = cue.text;
    cueElement.appendChild(text);

    content.appendChild(cueElement);
  });
}

// Filter transcript based on search
function filterTranscript(query) {
  const content = transcriptPanel.querySelector(".transcript-content");
  const cues = content.querySelectorAll(".transcript-cue");

  if (!query) {
    cues.forEach((cue) => {
      cue.style.display = "flex";
    });
    return;
  }

  query = query.toLowerCase();

  cues.forEach((cue) => {
    const text = cue
      .querySelector(".transcript-text")
      .textContent.toLowerCase();
    cue.style.display = text.includes(query) ? "flex" : "none";
  });
}

// Find the main video element on the page
function findVideoElement() {
  // Try to find the most prominent video
  const videos = Array.from(document.querySelectorAll("video"));

  if (videos.length === 0) {
    return null;
  }

  // Sort by size (assuming the main video is the largest)
  videos.sort((a, b) => {
    const aSize = a.offsetWidth * a.offsetHeight;
    const bSize = b.offsetWidth * b.offsetHeight;
    return bSize - aSize;
  });

  return videos[0];
}

// Update active timestamp based on current video time
function updateActiveTimestamp() {
  if (!videoElement || !transcriptData.length || !transcriptPanel) return;

  const currentTime = videoElement.currentTime;

  // Find the current cue
  let newActiveTimestamp = null;

  for (let i = transcriptData.length - 1; i >= 0; i--) {
    if (transcriptData[i].time <= currentTime) {
      newActiveTimestamp = transcriptData[i].time;
      break;
    }
  }

  if (newActiveTimestamp !== activeTimestamp) {
    activeTimestamp = newActiveTimestamp;

    // Update UI
    const cues = transcriptPanel.querySelectorAll(".transcript-cue");
    cues.forEach((cue) => {
      if (parseFloat(cue.dataset.time) === activeTimestamp) {
        cue.classList.add("active");
        cue.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        cue.classList.remove("active");
      }
    });
  }
}

// Find the video and transcript elements and display
async function findVideoAndShowTranscript(totalCues = 500, delay = 200) {
  // Find video
  videoElement = findVideoElement();

  if (!videoElement) {
    alert("No video found on this page.");
    return false;
  }

  // Create UI
  createTranscriptPanel();

  // Try to extract transcript
  try {
    transcriptData = await extractTranscript(totalCues, delay);

    if (transcriptData.length === 0) {
      transcriptPanel.querySelector(".transcript-content").innerHTML =
        '<div style="padding: 16px; color: #666;">No transcript found for this video. Make sure you\'re on a page with a transcript available.</div>';
      return false;
    }

    // Display transcript
    updateTranscriptDisplay();

    // Set up video time tracking
    videoElement.addEventListener("timeupdate", updateActiveTimestamp);

    return true;
  } catch (error) {
    console.error("Error extracting transcript:", error);
    transcriptPanel.querySelector(
      ".transcript-content"
    ).innerHTML = `<div style="padding: 16px; color: #666;">Error extracting transcript: ${error.message}</div>`;
    return false;
  }
}

// Extract transcript from webpage
async function extractTranscript(totalCues = 500, delay = 200) {
  let extractedTranscript = [];

  // First, try to find if there's a transcript container to determine max cues
  const containers = document.querySelectorAll('[id^="transcript-cue-"]');
  if (containers.length > 0 && containers.length > totalCues) {
    totalCues = containers.length;
    console.log(`Found ${totalCues} transcript cues on the page`);
  }

  // Check specific platforms
  // For YouTube
  if (window.location.hostname.includes("youtube.com")) {
    try {
      return await extractYouTubeTranscript();
    } catch (e) {
      console.error("YouTube transcript extraction failed:", e);
    }
  }

  // Generic extraction approach
  for (let i = 0; i <= totalCues; i++) {
    let element = document.querySelector(`#transcript-cue-${i}`);
    if (element) {
      // Try to extract timestamp
      let timestamp = 0;
      const timestampElement =
        element.querySelector("[data-time]") ||
        element.closest("[data-time]") ||
        element.querySelector("[data-timestamp]") ||
        element.closest("[data-timestamp]");

      if (timestampElement) {
        timestamp =
          parseFloat(
            timestampElement.dataset.time || timestampElement.dataset.timestamp
          ) || 0;
      } else {
        // Use index as a simple timestamp (for sequential cues)
        timestamp = i * 5; // Assume 5 seconds between cues
      }

      // Scroll the element into view
      element.scrollIntoView();
      await new Promise((resolve) => setTimeout(resolve, delay)); // Wait for it to load fully

      extractedTranscript.push({
        id: i,
        time: timestamp,
        text: element.innerText.trim(),
      });
    }
  }

  // Sort by timestamp
  extractedTranscript.sort((a, b) => a.time - b.time);

  return extractedTranscript;
}

// Special handling for YouTube transcripts
async function extractYouTubeTranscript() {
  let transcript = [];

  // Find the transcript panel
  const ytTranscriptItems = document.querySelectorAll(
    ".ytd-transcript-segment-renderer"
  );

  if (ytTranscriptItems.length === 0) {
    // Try to open the transcript panel if it's not already open
    const transcriptButton = Array.from(
      document.querySelectorAll("button")
    ).find((button) => button.innerText.includes("Show transcript"));

    if (transcriptButton) {
      transcriptButton.click();
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  // Now try again
  const items =
    document.querySelectorAll("ytd-transcript-segment-renderer") ||
    document.querySelectorAll(".ytd-transcript-segment-renderer") ||
    document.querySelectorAll('[class*="transcript-segment"]');

  for (const item of items) {
    const timestampEl = item.querySelector('[class*="timestamp"]');
    const textEl = item.querySelector('[class*="segment-text"]');

    if (timestampEl && textEl) {
      // Parse timestamp (format: MM:SS)
      const timestampText = timestampEl.innerText.trim();
      const [minutes, seconds] = timestampText.split(":").map(Number);
      const timeInSeconds = minutes * 60 + seconds;

      transcript.push({
        time: timeInSeconds,
        text: textEl.innerText.trim(),
      });
    }
  }

  return transcript;
}

// This function helps users set up the transcript settings
function setupTranscriptSettings() {
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

// Initialize when the page loads
function initialize() {
  createTranscriptButton();

  // For YouTube, check if we're on a video page
  if (
    window.location.hostname.includes("youtube.com") &&
    window.location.pathname.includes("/watch")
  ) {
    // Wait for YouTube's player to be ready
    setTimeout(() => {
      findVideoAndShowTranscript();
    }, 2000);
  }
}

// Run initialize when the page is fully loaded
if (document.readyState === "complete") {
  initialize();
} else {
  window.addEventListener("load", initialize);
}
