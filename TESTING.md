# Testing Guide for Keyboard Shortcuts Extension

## Installation Steps

1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **Load unpacked**
5. Select the `/Users/lazaro/Documents/javascript/keyshort/` folder
6. The extension should now appear in your extensions list

## Test Scenarios

### Test 1: Basic Functionality
**Objective**: Verify the default shortcut works

1. Open `test.html` in Chrome (or any website)
2. Click on any text input field
3. Type `test-`
4. Wait 300ms (about half a second)
5. **Expected**: Text should automatically change to `Keyshort Test`

✅ **Pass Criteria**: Pattern is replaced correctly

### Test 2: Delay Setting
**Objective**: Verify delay prevents premature replacement

1. Open the extension options (right-click extension icon → Options)
2. Set delay to 1000ms (1 second)
3. Click "Save Delay"
4. Open `test.html`
5. Type `test-` and immediately continue typing
6. **Expected**: No replacement should occur if you keep typing
7. Now type `test-` and wait 1 second
8. **Expected**: Replacement should occur after 1 second

✅ **Pass Criteria**: Delay setting works correctly

### Test 3: Exact Match Logic
**Objective**: Verify only exact matches are replaced

1. Open `test.html`
2. Test these patterns:
   - Type `test-` → Should replace ✅
   - Type `test-test` (keep typing) → Should NOT replace ❌
   - Type `testtest-` → Should NOT replace ❌
   - Type `test test-` → Should replace ✅
   - Type `test.test-` → Should replace ✅

✅ **Pass Criteria**: Only exact matches with word boundaries are replaced

### Test 4: Multiple Input Types
**Objective**: Verify extension works on all input types

1. Open `test.html`
2. Test in each field:
   - Text input field
   - Textarea
   - ContentEditable div
3. Type `test-` in each and verify replacement

✅ **Pass Criteria**: Works in all three input types

### Test 5: Add New Shortcut
**Objective**: Verify adding custom shortcuts

1. Open extension options
2. In "Add New Shortcut" section:
   - Pattern: `email-`
   - Replacement: `test@example.com`
3. Click "Add Shortcut"
4. **Expected**: Shortcut appears in "Current Shortcuts" list
5. Open `test.html`
6. Type `email-` and wait
7. **Expected**: Replaced with `test@example.com`

✅ **Pass Criteria**: New shortcut works correctly

### Test 6: Edit Shortcut
**Objective**: Verify editing shortcuts

1. Open extension options
2. Click "Edit" on any shortcut
3. **Expected**: Pattern and replacement populate in the form
4. Modify the replacement text
5. Click "Add Shortcut"
6. Test the modified shortcut

✅ **Pass Criteria**: Shortcut is updated correctly

### Test 7: Delete Shortcut
**Objective**: Verify deleting shortcuts

1. Open extension options
2. Click "Delete" on a shortcut
3. Confirm deletion
4. **Expected**: Shortcut removed from list
5. Try typing the deleted pattern
6. **Expected**: No replacement occurs

✅ **Pass Criteria**: Shortcut is deleted and no longer works

### Test 8: Export Shortcuts
**Objective**: Verify export functionality

1. Open extension options
2. Add 2-3 shortcuts
3. Click "📥 Export"
4. **Expected**: JSON file downloads (e.g., `keyboard-shortcuts-1234567890.json`)
5. Open the file in a text editor
6. **Expected**: Contains valid JSON with shortcuts and delay

✅ **Pass Criteria**: Export creates valid JSON file

### Test 9: Import Shortcuts
**Objective**: Verify import functionality

1. Delete all shortcuts in the extension
2. Click "📤 Import"
3. Select the previously exported JSON file
4. **Expected**: Success message appears
5. **Expected**: All shortcuts from file are restored
6. Test one of the imported shortcuts

✅ **Pass Criteria**: Import restores all shortcuts correctly

### Test 10: Persistence Across Sessions
**Objective**: Verify shortcuts persist after browser restart

1. Add several shortcuts
2. Close Chrome completely
3. Reopen Chrome
4. Open extension options
5. **Expected**: All shortcuts are still present
6. Test a shortcut on any website
7. **Expected**: Shortcuts still work

✅ **Pass Criteria**: Data persists across browser restarts

### Test 11: Real-World Websites
**Objective**: Verify extension works on actual websites

Test on these sites:
1. **Gmail** (compose email)
2. **Google Docs**
3. **Twitter/X** (compose tweet)
4. **Facebook** (post/comment)
5. **Any form on any website**

✅ **Pass Criteria**: Works on all major websites

### Test 12: Cursor Position
**Objective**: Verify cursor stays in correct position

1. Type: `Hello test- world`
2. Wait for replacement
3. **Expected**: `Hello Keyshort Test world`
4. **Expected**: Cursor is after the replacement, before " world"
5. Continue typing
6. **Expected**: Text inserts at cursor position

✅ **Pass Criteria**: Cursor position is preserved correctly

### Test 13: Special Characters
**Objective**: Verify special characters work in patterns

1. Add shortcuts with special characters:
   - `//` → `https://www.example.com`
   - `@@` → `admin@company.com`
   - `::` → `Important: `
2. Test each pattern
3. **Expected**: All work correctly

✅ **Pass Criteria**: Special characters are handled properly

### Test 14: Invalid Import
**Objective**: Verify error handling for invalid imports

1. Create a text file with invalid JSON
2. Try to import it
3. **Expected**: Error message displayed
4. **Expected**: Existing shortcuts unchanged

✅ **Pass Criteria**: Invalid imports are rejected gracefully

## Performance Tests

### Test 15: Multiple Shortcuts Performance
**Objective**: Verify performance with many shortcuts

1. Add 20+ shortcuts
2. Type in various fields
3. **Expected**: No noticeable lag or delay
4. **Expected**: Replacements still work correctly

✅ **Pass Criteria**: Extension performs well with many shortcuts

### Test 16: Rapid Typing
**Objective**: Verify handling of rapid typing

1. Type very quickly: `test-test-test-`
2. **Expected**: Each pattern is replaced correctly
3. **Expected**: No crashes or errors

✅ **Pass Criteria**: Handles rapid typing correctly

## Browser Compatibility

Test on:
- ✅ Chrome (primary target)
- ✅ Edge (Chromium-based, should work)
- ✅ Brave (Chromium-based, should work)

## Known Limitations

1. **Password fields**: Extension does not work in password fields (by design for security)
2. **Some rich text editors**: May not work in complex WYSIWYG editors with custom implementations
3. **iframes**: May not work in cross-origin iframes due to browser security

## Troubleshooting

If tests fail:
1. Check browser console for errors (F12 → Console)
2. Verify extension is enabled in `chrome://extensions/`
3. Try reloading the extension
4. Check that manifest.json is valid
5. Verify all files are in the correct directory

## Test Results Template

```
Date: _______________
Tester: _______________
Chrome Version: _______________

Test 1: Basic Functionality          [ ] Pass [ ] Fail
Test 2: Delay Setting                [ ] Pass [ ] Fail
Test 3: Exact Match Logic            [ ] Pass [ ] Fail
Test 4: Multiple Input Types         [ ] Pass [ ] Fail
Test 5: Add New Shortcut             [ ] Pass [ ] Fail
Test 6: Edit Shortcut                [ ] Pass [ ] Fail
Test 7: Delete Shortcut              [ ] Pass [ ] Fail
Test 8: Export Shortcuts             [ ] Pass [ ] Fail
Test 9: Import Shortcuts             [ ] Pass [ ] Fail
Test 10: Persistence                 [ ] Pass [ ] Fail
Test 11: Real-World Websites         [ ] Pass [ ] Fail
Test 12: Cursor Position             [ ] Pass [ ] Fail
Test 13: Special Characters          [ ] Pass [ ] Fail
Test 14: Invalid Import              [ ] Pass [ ] Fail
Test 15: Performance                 [ ] Pass [ ] Fail
Test 16: Rapid Typing                [ ] Pass [ ] Fail

Notes:
_________________________________
_________________________________
```

