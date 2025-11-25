# Keyboard Shortcuts Chrome Extension

A Chrome extension that automatically replaces typed patterns with predefined text shortcuts.

## Features

- **Exact Pattern Matching**: Replace specific text patterns with longer text
- **Configurable Delay**: Set a delay (default 300ms) before replacement to avoid premature triggers
- **Persistent Storage**: Shortcuts sync across devices via Chrome sync
- **Export/Import**: Backup and restore shortcuts as JSON files
- **Works Everywhere**: Functions on all websites in text inputs, textareas, and contenteditable elements

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `keyshort` folder

## Usage

### Adding Shortcuts

1. Click the extension icon or right-click and select "Options"
2. In the settings page, enter:
   - **Pattern**: The text to detect (e.g., `test-`)
   - **Replacement**: The text to replace it with (e.g., `Keyshort Test`)
3. Click "Add Shortcut"

### Using Shortcuts

Simply type your pattern in any text field. After the configured delay (default 300ms), it will automatically be replaced with your predefined text.

**Example:**
- Type: `test-`
- Wait 300ms
- Result: `Keyshort Test`

### Adjusting Delay

1. Open the extension options page
2. Change the "Replacement delay (ms)" value
3. Click "Save Delay"

### Export/Import

**Export:**
- Click "📥 Export" button to download your shortcuts as a JSON file

**Import:**
- Click "📤 Import" button and select a previously exported JSON file

## How It Works

1. The extension monitors all text input fields on web pages
2. When you type, it starts a timer based on your configured delay
3. After the delay expires (no more typing), it checks if the text ends with any of your patterns
4. If an exact match is found, it replaces the pattern with your replacement text
5. The cursor position is preserved after replacement

## Technical Details

- **Manifest Version**: V3
- **Permissions**: `storage`, `activeTab`
- **Storage**: Chrome sync storage (automatically backed up and synced)
- **Scope**: All URLs (`<all_urls>`)

## File Structure

```
keyshort/
├── manifest.json          # Extension configuration
├── content.js            # Pattern detection and replacement logic
├── storage.js            # Chrome storage helper functions
├── options.html          # Settings page UI
├── options.js            # Settings page logic
├── options.css           # Settings page styling
└── README.md             # This file
```

## Default Shortcuts

The extension comes with one default shortcut:
- `test-` → `Keyshort Test`

You can modify or delete this in the options page.

## Privacy

- All data is stored locally in Chrome's sync storage
- No data is sent to external servers
- The extension only monitors text input to detect patterns
- Export files are saved locally on your device

## Troubleshooting

**Shortcuts not working?**
- Check that the extension is enabled in `chrome://extensions/`
- Verify your pattern is correct in the options page
- Make sure you're waiting for the full delay period
- Check that the pattern matches exactly (not part of a larger word)

**Import failed?**
- Ensure the JSON file is properly formatted
- Check that the file contains valid shortcuts and delay values

## License

MIT License - Feel free to modify and distribute as needed.

