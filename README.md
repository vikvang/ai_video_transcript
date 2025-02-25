# Transcript Downloader Chrome Extension

A Chrome extension that helps you download transcripts from video websites such as Vimeo.

## Features

- Downloads transcript text from websites that use transcript cue elements
- Automatically scrolls through transcript elements to capture all content
- Adjustable parameters for total cues and delay time
- Context menu option for quick access
- Works best on Vimeo video pages with transcripts enabled

## Installation

1. Download or clone this repository to your local machine
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" by toggling the switch in the top right corner
4. Click "Load unpacked" and select the folder containing the extension files
5. The extension should now be installed and visible in your Chrome toolbar

## How to Use

### Basic Usage

1. Navigate to a video website with a transcript (like Vimeo)
2. If using Vimeo, make sure to:
   - Open the transcript panel
   - Go to transcript settings and turn off timestamps (for cleaner output)
3. Click the Transcript Downloader icon in your Chrome toolbar
4. Adjust settings if needed:
   - Total Transcript Cues: Increase this number if you have a longer video/transcript
   - Delay between cues: Increase this if transcript elements aren't loading properly
5. Click "Download Transcript"
6. The transcript will be saved as a text file

### Context Menu Option

You can also right-click anywhere on the page and select "Download Transcript" from the context menu.

## Troubleshooting

- If no transcript is found, make sure you're on a page that has transcript elements with IDs in the format `transcript-cue-X`
- If the transcript is incomplete, try increasing the "Total Transcript Cues" value
- If the transcript contains errors, try increasing the "Delay between cues" value
