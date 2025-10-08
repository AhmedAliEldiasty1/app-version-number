# Localization (i18n) Guide

## Overview

The App Version Manager now supports **bilingual localization** with **Arabic** and **English**, with **Arabic as the default language**.

## Features

### ✅ **Implemented Features**

- 🌐 Full Arabic and English translations
- 🔄 Dynamic language switching
- 📱 RTL (Right-to-Left) support for Arabic
- 💾 Language preference persistence in localStorage
- ♿ Accessibility support with proper ARIA labels
- 🎨 Smooth transitions between languages

### 🌍 **Supported Languages**

1. **Arabic (العربية)** - Default language
2. **English** - Secondary language

## File Structure

```
src/
├── i18n/
│   ├── LanguageContext.tsx    # Language context provider
│   └── translations.ts         # Translation strings
├── components/
│   ├── AppSelector.tsx         # Localized
│   ├── VersionList.tsx         # Localized
│   └── VersionForm.tsx         # Localized
├── App.tsx                     # Localized with language toggle
└── index.tsx                   # Wrapped with LanguageProvider
```

## Usage

### **Language Toggle Button**

A language toggle button appears in the top-right corner of the header:

- Shows "English" when Arabic is active
- Shows "عربي" when English is active
- Smoothly switches between languages
- Saves preference to localStorage

### **Using Translations in Components**

```typescript
import { useLanguage } from "../i18n/LanguageContext";

const MyComponent = () => {
  const { t, language, setLanguage, isRTL } = useLanguage();

  return (
    <div>
      <h1>{t.appTitle}</h1>
      <p>{t.appSubtitle}</p>
    </div>
  );
};
```

### **Available Context Properties**

```typescript
interface LanguageContextType {
  language: "ar" | "en"; // Current language
  setLanguage: (lang) => void; // Change language function
  t: Translations; // Translation object
  isRTL: boolean; // Is RTL direction
}
```

## Translation Keys

### **Header Section**

- `appTitle` - App title
- `appSubtitle` - App subtitle
- `language` - Language label
- `switchToEnglish` - Switch to English text
- `switchToArabic` - Switch to Arabic text

### **Configuration Section**

- `configurationTitle` - Configuration section title
- `selectSchool` - Select school label
- `selectSchoolPlaceholder` - School dropdown placeholder
- `selectAppType` - Select app type label
- `selectAppTypePlaceholder` - App type dropdown placeholder
- `apiBaseUrl` - API base URL label
- `apiBaseUrlHelp` - API base URL help text
- `required` - Required field indicator

### **App Types**

- `employeeApp` - Employee app name
- `parentApp` - Parent app name

### **Tabs**

- `listVersionsTab` - List versions tab
- `addUpdateVersionTab` - Add/update version tab

### **Version List**

- `appVersionsTitle` - App versions title
- `platform` - Platform label
- `ios` - iOS platform name
- `android` - Android platform name
- `refreshData` - Refresh data button
- `loading` - Loading text
- `loadingVersions` - Loading versions text
- `version` - Version label
- `active` - Active status
- `inactive` - Inactive status
- `app` - App label
- `created` - Created date label
- `updated` - Updated date label
- `noDataMessage` - No data message
- `selectConfigMessage` - Select configuration message
- `noVersionsFound` - No versions found message
- `clickToToggle` - Click to toggle tooltip
- `togglingStatus` - Toggling status text
- `updating` - Updating text

### **Version Form**

- `addUpdateVersionTitle` - Add/update version title
- `configRequired` - Configuration required text
- `configRequiredMessage` - Configuration required message
- `versionNumber` - Version number label
- `versionPlaceholder` - Version input placeholder
- `versionHelp` - Version help text
- `platformType` - Platform type label
- `selectPlatformPlaceholder` - Platform dropdown placeholder
- `status` - Status label
- `selectStatusPlaceholder` - Status dropdown placeholder
- `statusHelp` - Status help text
- `submittingVersion` - Submitting version text
- `saveVersion` - Save version button
- `resetForm` - Reset form button

### **Messages**

- `errorPrefix` - Error prefix
- `successPrefix` - Success prefix
- `versionSavedSuccess` - Version saved success message
- `versionActivated` - Version activated text
- `versionDeactivated` - Version deactivated text
- `selectBothMessage` - Select both message
- `invalidVersionFormat` - Invalid version format message
- `failedToSave` - Failed to save message
- `requestFailed` - Request failed message

## Adding New Translations

### 1. **Add to Translation Interface**

Edit `src/i18n/translations.ts`:

```typescript
export interface Translations {
  // ... existing keys
  newKey: string;
}
```

### 2. **Add Arabic Translation**

```typescript
export const translations = {
  ar: {
    // ... existing translations
    newKey: "النص بالعربية",
  },
  // ...
};
```

### 3. **Add English Translation**

```typescript
export const translations = {
  // ...
  en: {
    // ... existing translations
    newKey: "Text in English",
  },
};
```

### 4. **Use in Component**

```typescript
const MyComponent = () => {
  const { t } = useLanguage();
  return <span>{t.newKey}</span>;
};
```

## RTL Support

### **Automatic RTL Detection**

The app automatically applies RTL (Right-to-Left) direction when Arabic is selected:

```typescript
document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
```

### **RTL CSS Classes**

CSS automatically adapts to RTL:

```css
[dir="rtl"] .form-actions {
  flex-direction: row-reverse;
}

[dir="rtl"] .btn-secondary {
  margin-left: 0;
  margin-right: 10px;
}

[dir="rtl"] .language-toggle {
  right: auto;
  left: 20px;
}
```

## Persistence

Language preference is automatically saved to `localStorage`:

```typescript
localStorage.setItem("appLanguage", lang);
```

On app load, the saved preference is restored:

```typescript
const savedLang = localStorage.getItem("appLanguage");
if (savedLang && (savedLang === "ar" || savedLang === "en")) {
  setLanguage(savedLang);
} else {
  // Default to Arabic
  setLanguage("ar");
}
```

## Accessibility

### **ARIA Labels**

All interactive elements have localized ARIA labels:

```typescript
<button aria-label={t.saveVersion}>{t.saveVersion}</button>
```

### **Language Attribute**

The HTML document language attribute updates automatically:

```typescript
document.documentElement.lang = lang; // 'ar' or 'en'
```

## Testing

Test these scenarios:

- [ ] Default language is Arabic on first load
- [ ] Language toggle switches between Arabic and English
- [ ] Text direction changes correctly (RTL/LTR)
- [ ] Language preference persists after page refresh
- [ ] All UI text is translated
- [ ] Form validation messages are localized
- [ ] Success/error messages are localized
- [ ] Date formats display correctly
- [ ] ARIA labels are properly localized

## Best Practices

### ✅ **Do's**

- Always use translation keys (`t.keyName`)
- Test both languages thoroughly
- Keep translations consistent
- Update both Arabic and English when adding new text
- Use semantic translation keys
- Consider cultural context in translations

### ❌ **Don'ts**

- Don't hardcode text in components
- Don't forget to add RTL CSS for new layouts
- Don't use machine translation without review
- Don't mix languages in the same sentence
- Don't assume text length will be the same

## Future Enhancements

Consider adding:

- [ ] More languages (French, Spanish, etc.)
- [ ] Language detection based on browser settings
- [ ] Date/time localization (moment.js or date-fns)
- [ ] Number formatting per locale
- [ ] Pluralization support
- [ ] Translation management system
- [ ] Translation verification tests

---

**Localization completed successfully! 🌍**

The app now fully supports Arabic (default) and English with seamless switching and RTL support.
