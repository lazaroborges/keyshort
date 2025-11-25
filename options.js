// Options page script

let currentShortcuts = {};
let currentDelay = 300;

// DOM elements
const delayInput = document.getElementById('delay-input');
const saveDelayBtn = document.getElementById('save-delay-btn');
const patternInput = document.getElementById('pattern-input');
const replacementInput = document.getElementById('replacement-input');
const addBtn = document.getElementById('add-btn');
const shortcutsContainer = document.getElementById('shortcuts-container');
const exportBtn = document.getElementById('export-btn');
const importFile = document.getElementById('import-file');
const messageDiv = document.getElementById('message');

// Show message
function showMessage(text, type = 'success') {
  messageDiv.textContent = text;
  messageDiv.className = `message ${type} show`;
  
  setTimeout(() => {
    messageDiv.classList.remove('show');
  }, 3000);
}

// Load settings
async function loadSettings() {
  const settings = await getAllSettings();
  currentShortcuts = settings.shortcuts;
  currentDelay = settings.delay;
  
  delayInput.value = currentDelay;
  renderShortcuts();
}

// Render shortcuts list
function renderShortcuts() {
  shortcutsContainer.innerHTML = '';
  
  const entries = Object.entries(currentShortcuts);
  
  if (entries.length === 0) {
    shortcutsContainer.innerHTML = `
      <div class="empty-state">
        <p>No shortcuts yet. Add one above!</p>
      </div>
    `;
    return;
  }
  
  entries.forEach(([pattern, replacement]) => {
    const item = document.createElement('div');
    item.className = 'shortcut-item';
    item.innerHTML = `
      <div class="shortcut-info">
        <div class="shortcut-pattern">${escapeHtml(pattern)}</div>
        <div class="shortcut-replacement">→ ${escapeHtml(replacement)}</div>
      </div>
      <div class="shortcut-actions">
        <button class="btn btn-edit" data-pattern="${escapeHtml(pattern)}">Edit</button>
        <button class="btn btn-danger" data-pattern="${escapeHtml(pattern)}">Delete</button>
      </div>
    `;
    
    shortcutsContainer.appendChild(item);
  });
  
  // Add event listeners to delete buttons
  document.querySelectorAll('.btn-danger').forEach(btn => {
    btn.addEventListener('click', handleDelete);
  });
  
  // Add event listeners to edit buttons
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', handleEdit);
  });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Save delay
async function handleSaveDelay() {
  const delay = parseInt(delayInput.value);
  
  if (isNaN(delay) || delay < 0) {
    showMessage('Please enter a valid delay value', 'error');
    return;
  }
  
  currentDelay = delay;
  await saveDelay(delay);
  showMessage('Delay saved successfully!');
}

// Add shortcut
async function handleAddShortcut() {
  const pattern = patternInput.value.trim();
  const replacement = replacementInput.value.trim();
  
  if (!pattern) {
    showMessage('Please enter a pattern', 'error');
    return;
  }
  
  if (!replacement) {
    showMessage('Please enter a replacement text', 'error');
    return;
  }
  
  currentShortcuts[pattern] = replacement;
  await saveShortcuts(currentShortcuts);
  
  patternInput.value = '';
  replacementInput.value = '';
  
  renderShortcuts();
  showMessage('Shortcut added successfully!');
}

// Delete shortcut
async function handleDelete(event) {
  const pattern = event.target.dataset.pattern;
  
  if (confirm(`Delete shortcut "${pattern}"?`)) {
    delete currentShortcuts[pattern];
    await saveShortcuts(currentShortcuts);
    renderShortcuts();
    showMessage('Shortcut deleted successfully!');
  }
}

// Edit shortcut
function handleEdit(event) {
  const pattern = event.target.dataset.pattern;
  const replacement = currentShortcuts[pattern];
  
  patternInput.value = pattern;
  replacementInput.value = replacement;
  
  // Scroll to form
  document.querySelector('.add-shortcut').scrollIntoView({ behavior: 'smooth' });
  patternInput.focus();
}

// Export shortcuts
async function handleExport() {
  const settings = await getAllSettings();
  exportSettings(settings);
  showMessage('Settings exported successfully!');
}

// Import shortcuts
async function handleImport(event) {
  const file = event.target.files[0];
  
  if (!file) return;
  
  try {
    const settings = await importSettings(file);
    currentShortcuts = settings.shortcuts;
    currentDelay = settings.delay || 300;
    
    delayInput.value = currentDelay;
    renderShortcuts();
    
    showMessage('Settings imported successfully!');
  } catch (error) {
    showMessage(`Import failed: ${error.message}`, 'error');
  }
  
  // Reset file input
  event.target.value = '';
}

// Event listeners
saveDelayBtn.addEventListener('click', handleSaveDelay);
addBtn.addEventListener('click', handleAddShortcut);
exportBtn.addEventListener('click', handleExport);
importFile.addEventListener('change', handleImport);

// Allow Enter key to add shortcut
patternInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleAddShortcut();
});

replacementInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleAddShortcut();
});

// Load settings on page load
loadSettings();

