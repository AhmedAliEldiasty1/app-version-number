# 🏫 School Manager Feature

## Overview

The School Manager feature allows you to dynamically add, view, and delete school API configurations without modifying the source code. Schools added through this interface are stored in localStorage and persist across browser sessions.

## Features

### ✨ Dynamic School Management

- Add new schools on-the-fly through a user-friendly interface
- View all custom schools in a beautiful list interface
- Delete schools with confirmation prompt
- No need to edit configuration files or redeploy the application
- Automatic validation of input fields

### 🎨 Beautiful UI

- Modern card-based design with gradient backgrounds
- Smooth animations (fade in, scale, slide effects)
- Interactive hover states with elevation changes
- Color-coded buttons (purple for add, green for view, red for delete)
- Responsive design for mobile and desktop

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
- Confirmation prompt before deletion

## Usage

### Adding a New School

1. **Click the "Add New School" button** (or "➕ إضافة مدرسة جديدة" in Arabic)

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

### Viewing Custom Schools

1. **Click the "View Custom Schools" button** (or "📋 عرض المدارس المخصصة" in Arabic)

   - The button appears next to "Add New School" button
   - Shows the count of custom schools in parentheses
   - Features a gradient green background
   - Only visible when custom schools exist

2. **Browse your schools**
   - View all custom schools in a scrollable list
   - Each school shows:
     - School name (large, bold)
     - School key (in a purple badge)
     - API URL (in monospace font)

### Deleting a School

1. **In the Custom Schools list, click the delete button (🗑️)** on any school

   - Red gradient button appears on the right side of each school item
   - Button has hover animation with elevation

2. **Confirm deletion**

   - A confirmation panel slides in
   - Shows warning: "⚠️ Are you sure you want to delete this school?"
   - Two options appear:
     - **Cancel**: Returns to the list without deleting
     - **Delete** (🗑️): Permanently removes the school

3. **After deletion**
   - School is removed from localStorage
   - School disappears from the list
   - If the deleted school was selected, selection is cleared
   - Dropdown updates immediately

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

2. **src/components/SchoolList.tsx** - New component

   - Displays list of custom schools
   - Handles delete confirmation
   - Shows school details in cards

3. **src/App.tsx** - Updated

   - Added `customSchools` state
   - Added `handleDeleteSchool` function
   - Loads schools from localStorage on mount
   - Merges custom schools with pre-configured schools
   - Passes combined configs to AppSelector
   - Clears selection when deleted school was active

4. **src/index.css** - Extended

   - Added `.school-manager` styles
   - Added `.school-list-container` and related styles
   - Modern card design with animations
   - Color-coded buttons (green for view, red for delete)
   - RTL support for Arabic
   - Responsive design for mobile

5. **src/i18n/ar.ts & en.ts** - Extended

   - Added translations for all form labels
   - Added delete and view translations
   - Error messages and help text
   - Success and confirmation messages

6. **src/i18n/translations.ts** - Extended
   - Added type definitions for new translation keys
   - Delete and view-related properties

## Styling Details

### Button Styles

- **Add School Button**: Purple gradient with rotate animation on icon hover
- **View Schools Button**: Green gradient with count badge, appears next to Add button
- **Delete Button**: Red gradient circle with trash icon, hover elevation effect
- **Delete Confirm Button**: Red gradient with shadow
- **Delete Cancel Button**: White with gray border
- **Close Button**: Semi-transparent circle with rotate animation
- **Save Button**: Purple gradient with elevation changes
- **Cancel Button**: Outlined gray with hover effects

### Form Card

- White background with subtle shadow
- Purple gradient header for add form
- Green gradient header for school list
- Smooth scale-in animation on open
- Maximum width of 700px for add form, 900px for list

### School List Items

- Card-based layout with hover elevation
- School name in large bold text
- School key in purple badge with monospace font
- API URL in gray monospace font
- Delete button on the right (red gradient circle)
- Confirmation panel slides in when delete is clicked
- Smooth animations (slide in from appropriate direction)

### Input Fields

- Clean white background
- Border color changes on focus (purple glow)
- Lift animation on focus (-2px transform)
- Help text below each field

### Alerts

- **Error**: Red gradient background with warning icon
- **Success**: Green gradient background with checkmark
- **Confirmation**: Red gradient panel with warning icon
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
- "Are you sure you want to delete this school?"

### Arabic

- "معرّف المدرسة مطلوب"
- "اسم المدرسة مطلوب"
- "رابط API مطلوب"
- "صيغة الرابط غير صحيحة"
- "⚠️ هل أنت متأكد من حذف هذه المدرسة؟"

## Success Messages

### English

- "School added successfully!"
- "School deleted successfully!"

### Arabic

- "تمت إضافة المدرسة بنجاح!"
- "تم حذف المدرسة بنجاح!"

## Browser Compatibility

- Modern browsers with localStorage support
- CSS animations and transforms
- Flexbox and Grid layout

## Future Enhancements

Potential improvements:

- ✅ ~~Delete custom schools~~ (Implemented!)
- Edit existing custom schools
- Export/import school configurations
- School configuration validation (test API connection)
- Bulk import from file
- Share configurations across devices (server sync)
- Search/filter in school list

## Notes

- Custom schools are stored per-browser (localStorage)
- Clearing browser data will remove custom schools
- Pre-configured schools from `config.ts` cannot be edited or deleted through UI
- Only custom schools can be deleted
- School keys must be unique (new schools overwrite existing ones with same key)
- Deleting a school that is currently selected will clear the selection
- Confirmation prompt prevents accidental deletions
