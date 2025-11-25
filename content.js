// Content script for keyboard shortcuts replacement

let shortcuts = {};
let delay = 300;
let typingTimer = null;

// Initialize shortcuts and delay from storage
async function init() {
  const settings = await getAllSettings();
  shortcuts = settings.shortcuts;
  delay = settings.delay;
}

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    if (changes.shortcuts) {
      shortcuts = changes.shortcuts.newValue;
    }
    if (changes.delay) {
      delay = changes.delay.newValue;
    }
  }
});

// Check if element is editable
function isEditableElement(element) {
  if (!element) return false;
  
  const tagName = element.tagName.toLowerCase();
  
  // Check for input and textarea
  if (tagName === 'input' || tagName === 'textarea') {
    return !element.disabled && !element.readOnly;
  }
  
  // Check for contenteditable
  if (element.isContentEditable) {
    return true;
  }
  
  return false;
}

// Get text before cursor in input/textarea
function getTextBeforeCursor(element) {
  if (element.tagName.toLowerCase() === 'input' || element.tagName.toLowerCase() === 'textarea') {
    return element.value.substring(0, element.selectionStart);
  }
  
  // For contenteditable
  if (element.isContentEditable) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      return preCaretRange.toString();
    }
  }
  
  return '';
}

// Replace text in input/textarea
function replaceTextInInput(element, pattern, replacement) {
  const value = element.value;
  const cursorPos = element.selectionStart;
  const textBefore = value.substring(0, cursorPos);
  
  // Check if pattern matches exactly at the end
  if (textBefore.endsWith(pattern)) {
    const newTextBefore = textBefore.substring(0, textBefore.length - pattern.length) + replacement;
    const textAfter = value.substring(cursorPos);
    
    element.value = newTextBefore + textAfter;
    
    // Set cursor position after replacement
    const newCursorPos = newTextBefore.length;
    element.setSelectionRange(newCursorPos, newCursorPos);
    
    // Trigger input event so the page knows the value changed
    element.dispatchEvent(new Event('input', { bubbles: true }));
    
    return true;
  }
  
  return false;
}

// Replace text in contenteditable
function replaceTextInContentEditable(element, pattern, replacement) {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return false;
  
  const range = selection.getRangeAt(0);
  const textBefore = getTextBeforeCursor(element);
  
  // Check if pattern matches exactly at the end
  if (textBefore.endsWith(pattern)) {
    // Create a range for the pattern text
    const patternRange = range.cloneRange();
    patternRange.setStart(range.endContainer, range.endOffset - pattern.length);
    patternRange.setEnd(range.endContainer, range.endOffset);
    
    // Delete the pattern and insert replacement
    patternRange.deleteContents();
    const textNode = document.createTextNode(replacement);
    patternRange.insertNode(textNode);
    
    // Move cursor to end of replacement
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);
    
    // Trigger input event
    element.dispatchEvent(new Event('input', { bubbles: true }));
    
    return true;
  }
  
  return false;
}

// Check for pattern match and replace
function checkAndReplace(element) {
  if (!isEditableElement(element)) return;
  
  const textBefore = getTextBeforeCursor(element);
  
  // Check each shortcut pattern
  for (const [pattern, replacement] of Object.entries(shortcuts)) {
    // Exact match: text must end with pattern
    if (textBefore.endsWith(pattern)) {
      // Check if the character before the pattern is a word boundary or start of text
      const beforePattern = textBefore.substring(0, textBefore.length - pattern.length);
      const lastChar = beforePattern[beforePattern.length - 1];
      
      // Only replace if it's truly an exact match (not part of a larger word)
      // Allow replacement if: start of text, or preceded by space/punctuation
      if (beforePattern.length === 0 || /[\s\n\r\t.,;:!?]/.test(lastChar)) {
        if (element.isContentEditable) {
          replaceTextInContentEditable(element, pattern, replacement);
        } else {
          replaceTextInInput(element, pattern, replacement);
        }
        break; // Only replace first match
      }
    }
  }
}

// Handle input events
function handleInput(event) {
  const element = event.target;
  
  if (!isEditableElement(element)) return;
  
  // Clear existing timer
  if (typingTimer) {
    clearTimeout(typingTimer);
  }
  
  // Set new timer
  typingTimer = setTimeout(() => {
    checkAndReplace(element);
  }, delay);
}

// Add event listeners to document
document.addEventListener('input', handleInput, true);
document.addEventListener('keyup', handleInput, true);

// Initialize on load
init();

