# Video Transcript Viewer Chrome Extension

A Chrome extension that displays video transcripts alongside videos, similar to YouTube's transcript feature.

## Features

- Displays transcript text alongside videos in a convenient side panel
- Auto-highlights the current transcript section as the video plays
- Click on any transcript segment to jump to that part of the video
- Search within the transcript to find specific content
- Toggle timestamps on/off
- Works on YouTube and other video sites with transcript elements
- Context menu option for quick access

## Installation

1. Download or clone this repository to your local machine
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" by toggling the switch in the top right corner
4. Click "Load unpacked" and select the folder containing the extension files
5. The extension should now be installed and visible in your Chrome toolbar

## How to Use

### Basic Usage

1. Navigate to a video website (like YouTube)
2. Click the Video Transcript Viewer icon in your Chrome toolbar
3. Click "Show Transcript Panel"
4. The transcript panel will appear on the right side of the screen
5. As the video plays, the current section of the transcript will be highlighted
6. Click on any transcript segment to jump to that part of the video
7. Use the search box to find specific text in the transcript

### On YouTube

The extension will automatically detect when you're on a YouTube video page and show a transcript button. When you click it:

1. If a transcript is available, it will be displayed in the panel
2. The panel will highlight the current segment being spoken in the video
3. You can click on any segment to jump to that part of the video

### Context Menu Option

You can also right-click anywhere on a video page and select "Show Video Transcript" from the context menu.

## Settings

From the extension popup, you can adjust:

- **Max Transcript Cues**: Increase this number if you have a longer video/transcript
- **Delay between cues**: Adjust if transcript elements aren't loading properly

## Troubleshooting

- If no transcript is found, the extension will display a message in the panel
- Some websites may not have transcript data accessible to the extension
- If the transcript is not highlighting in sync with the video, try refreshing the page

## License

This project is open source and available under the MIT License.

## Credits

Created by [Your Name]
