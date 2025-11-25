// Storage helper functions for Chrome extension

const DEFAULT_SHORTCUTS = {
  "lazaro-": "lazaro@parsa-ai.com.br"
};

const DEFAULT_DELAY = 300;

// Get shortcuts from storage
async function getShortcuts() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['shortcuts'], (result) => {
      resolve(result.shortcuts || DEFAULT_SHORTCUTS);
    });
  });
}

// Get delay setting from storage
async function getDelay() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['delay'], (result) => {
      resolve(result.delay || DEFAULT_DELAY);
    });
  });
}

// Save shortcuts to storage
async function saveShortcuts(shortcuts) {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ shortcuts }, () => {
      resolve();
    });
  });
}

// Save delay to storage
async function saveDelay(delay) {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ delay }, () => {
      resolve();
    });
  });
}

// Get all settings (shortcuts + delay)
async function getAllSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['shortcuts', 'delay'], (result) => {
      resolve({
        shortcuts: result.shortcuts || DEFAULT_SHORTCUTS,
        delay: result.delay || DEFAULT_DELAY
      });
    });
  });
}

// Save all settings (shortcuts + delay)
async function saveAllSettings(settings) {
  return new Promise((resolve) => {
    chrome.storage.sync.set(settings, () => {
      resolve();
    });
  });
}

// Export settings to JSON
function exportSettings(settings) {
  const dataStr = JSON.stringify(settings, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `keyboard-shortcuts-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Import settings from JSON
async function importSettings(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const settings = JSON.parse(e.target.result);
        
        // Validate structure
        if (!settings.shortcuts || typeof settings.shortcuts !== 'object') {
          throw new Error('Invalid shortcuts format');
        }
        
        if (settings.delay !== undefined && (typeof settings.delay !== 'number' || settings.delay < 0)) {
          throw new Error('Invalid delay value');
        }
        
        // Save to storage
        await saveAllSettings({
          shortcuts: settings.shortcuts,
          delay: settings.delay || DEFAULT_DELAY
        });
        
        resolve(settings);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

// Initialize storage with defaults if empty
async function initializeStorage() {
  const settings = await getAllSettings();
  
  // If storage is completely empty, set defaults
  if (Object.keys(settings.shortcuts).length === 0) {
    await saveAllSettings({
      shortcuts: DEFAULT_SHORTCUTS,
      delay: DEFAULT_DELAY
    });
  }
}

