# 🏫 School Manager Feature

## Overview

The School Manager feature allows you to dynamically add new school API configurations without modifying the source code. Schools added through this interface are stored in localStorage and persist across browser sessions.

## Features

### ✨ Dynamic School Addition

- Add new schools on-the-fly through a user-friendly interface
- No need to edit configuration files or redeploy the application
- Automatic validation of input fields

### 🎨 Beautiful UI

- Modern card-based design with gradient backgrounds
- Smooth animations (fade in, scale, slide effects)
- Interactive hover states with elevation changes
- Purple theme matching the app's design system

### 🌐 Bilingual Support

- Full Arabic and English translations
- RTL support for Arabic interface
- Context-aware help text and placeholders

### 💾 Data Persistence

- Schools are saved to localStorage
- Automatically loads saved schools on app startup
- No server-side storage required

### 🔒 Security

- URL validation (must be HTTPS)
- Input sanitization for school keys (kebab-case conversion)
- Required field validation

## Usage

### Adding a New School

1. **Click the "Add New School" button** (or "إضافة مدرسة جديدة" in Arabic)

   - The button appears at the top of the configuration section
   - Features a gradient purple background with a rotate animation on hover

2. **Fill in the form fields:**

   - **School Key (ID)**: A unique identifier (e.g., `my-school`)

     - Automatically converts to lowercase kebab-case
     - Only letters, numbers, and hyphens allowed
     - Used internally to reference the school

   - **School Name**: Display name (e.g., `My School Name`)

     - This is what users see in the dropdown
     - Can contain any characters

   - **API Base URL**: The API endpoint (e.g., `https://api.example.com/api/v1/ar`)
     - Must start with `https://` for security
     - Should point to the school's API version endpoint

3. **Save the school**
   - Click the "Save" button (💾 حفظ)
   - The form validates all inputs
   - Success message appears for 2 seconds
   - The new school is automatically selected
   - Form closes and school appears in the dropdown

### Using a Custom School

After adding a school:

1. The school automatically appears in the "Select School" dropdown
2. Select it like any pre-configured school
3. Choose an app type (Employee or Parent)
4. Fetch and manage versions as usual

### Canceling

- Click the "Cancel" button to close the form without saving
- Or click the "✕" button in the header
- All entered data is cleared

## Technical Details

### Data Structure

Schools are stored in localStorage as JSON:

```json
{
  "my-school": {
    "name": "My School Name",
    "baseUrl": "https://api.example.com/api/v1/ar"
  }
}
```

### Files Modified

1. **src/components/SchoolManager.tsx** - New component

   - Handles the add school form and logic
   - Validates inputs
   - Manages form state

2. **src/App.tsx** - Updated

   - Added `customSchools` state
   - Loads schools from localStorage on mount
   - Merges custom schools with pre-configured schools
   - Passes combined configs to AppSelector

3. **src/index.css** - Extended

   - Added `.school-manager` styles
   - Modern card design with animations
   - RTL support for Arabic

4. **src/i18n/ar.ts & en.ts** - Extended

   - Added translations for all form labels
   - Error messages and help text
   - Success messages

5. **src/i18n/translations.ts** - Extended
   - Added type definitions for new translation keys

## Styling Details

### Button Styles

- **Add School Button**: Purple gradient with rotate animation on icon hover
- **Close Button**: Semi-transparent circle with rotate animation
- **Save Button**: Purple gradient with elevation changes
- **Cancel Button**: Outlined gray with hover effects

### Form Card

- White background with subtle shadow
- Purple gradient header
- Smooth scale-in animation on open
- Maximum width of 700px for optimal reading

### Input Fields

- Clean white background
- Border color changes on focus (purple glow)
- Lift animation on focus (-2px transform)
- Help text below each field

### Alerts

- **Error**: Red gradient background with warning icon
- **Success**: Green gradient background with checkmark
- Slide-in animation from appropriate side (RTL-aware)

## Validation Rules

### School Key

- Required field
- Converted to lowercase
- Spaces replaced with hyphens
- Only alphanumeric characters and hyphens allowed
- Example: "My School 123" → "my-school-123"

### School Name

- Required field
- No special validation (any characters allowed)
- Used as display name in dropdown

### API Base URL

- Required field
- Must be a valid URL
- Must start with `https://` (enforced for security)
- Should point to complete API endpoint

## Error Messages

### English

- "School key is required"
- "School name is required"
- "API URL is required"
- "Invalid URL format"

### Arabic

- "معرّف المدرسة مطلوب"
- "اسم المدرسة مطلوب"
- "رابط API مطلوب"
- "صيغة الرابط غير صحيحة"

## Success Message

### English

"School added successfully!"

### Arabic

"تمت إضافة المدرسة بنجاح!"

## Browser Compatibility

- Modern browsers with localStorage support
- CSS animations and transforms
- Flexbox and Grid layout

## Future Enhancements

Potential improvements:

- Edit existing custom schools
- Delete custom schools
- Export/import school configurations
- School configuration validation (test API connection)
- Bulk import from file
- Share configurations across devices (server sync)

## Notes

- Custom schools are stored per-browser (localStorage)
- Clearing browser data will remove custom schools
- Pre-configured schools from `config.ts` cannot be edited through UI
- School keys must be unique (new schools overwrite existing ones with same key)
