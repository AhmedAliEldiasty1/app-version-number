# Firebase Configuration Template

This file contains a template for your Firebase configuration. Copy this template and replace the placeholder values with your actual Firebase project credentials.

## How to Get Your Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click the gear icon ⚙️ → Project settings
4. Scroll down to "Your apps" section
5. Click on your web app (or create one if you haven't)
6. Look for "Firebase SDK snippet"
7. Select "Config" option
8. Copy the `firebaseConfig` object

## Template

```typescript
// src/utils/firebase.ts

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// Get these values from Firebase Console → Project Settings → Your App
const firebaseConfig = {
  // API Key - Safe to expose publicly
  // This is NOT a secret key
  // Example: "AIzaSyABCDEFGHIJKLMNOPQRSTUVWXYZ1234567"
  apiKey: "YOUR_API_KEY_HERE",

  // Auth Domain - Usually your-project-id.firebaseapp.com
  // Example: "my-school-manager.firebaseapp.com"
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",

  // Project ID - Your Firebase project identifier
  // Example: "my-school-manager"
  projectId: "YOUR_PROJECT_ID",

  // Storage Bucket - Usually your-project-id.appspot.com
  // Example: "my-school-manager.appspot.com"
  storageBucket: "YOUR_PROJECT_ID.appspot.com",

  // Messaging Sender ID - Numeric ID for Firebase Cloud Messaging
  // Example: "123456789012"
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",

  // App ID - Unique identifier for your Firebase app
  // Example: "1:123456789012:web:abcdef123456789"
  appId: "YOUR_APP_ID",

  // (Optional) Measurement ID - For Google Analytics
  // Only present if you enabled Analytics
  // Example: "G-ABCDEFGHIJ"
  // measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
```

## Example (Filled)

**⚠️ WARNING: These are example values. DO NOT use these in your actual app!**

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyABCDEFGHIJKLMNOPQRSTUVWXYZ1234567",
  authDomain: "my-school-manager.firebaseapp.com",
  projectId: "my-school-manager",
  storageBucket: "my-school-manager.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789",
};
```

## Verification Checklist

After updating your configuration, verify:

- [ ] All placeholder text replaced (no "YOUR_" text remaining)
- [ ] apiKey starts with "AIza"
- [ ] authDomain ends with ".firebaseapp.com"
- [ ] storageBucket ends with ".appspot.com"
- [ ] messagingSenderId is a 12-digit number
- [ ] appId follows format: "1:numbers:web:letters"
- [ ] No extra spaces or line breaks
- [ ] No syntax errors (commas, quotes, etc.)

## Common Mistakes

### ❌ Wrong: Keeping placeholder text
```typescript
apiKey: "YOUR_API_KEY_HERE",  // Wrong!
```

### ✅ Right: Actual Firebase API key
```typescript
apiKey: "AIzaSyABCDEFGHIJKLMNOPQRSTUVWXYZ1234567",  // Correct!
```

### ❌ Wrong: Missing quotes
```typescript
apiKey: AIzaSyABCDEFGHIJKLMNOPQRSTUVWXYZ1234567,  // Wrong!
```

### ✅ Right: Properly quoted
```typescript
apiKey: "AIzaSyABCDEFGHIJKLMNOPQRSTUVWXYZ1234567",  // Correct!
```

### ❌ Wrong: Using someone else's config
```typescript
// Copied from tutorial or GitHub repo
const firebaseConfig = { /* someone else's credentials */ };  // Wrong!
```

### ✅ Right: Your own Firebase project config
```typescript
// Your own Firebase project credentials
const firebaseConfig = { /* your credentials from Firebase Console */ };  // Correct!
```

## Security Notes

### Safe to Expose Publicly ✅
- `apiKey` - Not a secret, safe in client-side code
- `authDomain` - Public domain name
- `projectId` - Public identifier
- `storageBucket` - Public bucket name
- `messagingSenderId` - Public ID
- `appId` - Public app identifier

### How Security Works 🔒
- **Firestore Security Rules** protect your data, not the API key
- API key identifies your Firebase project, doesn't grant access
- Security rules determine who can read/write data
- Authentication determines user identity

### Best Practices 📋
1. Set proper Firestore Security Rules (see FIREBASE_SETUP_GUIDE.md)
2. Enable authentication if you need private data
3. Use environment variables in production (optional)
4. Monitor usage in Firebase Console
5. Set up billing alerts (optional)

## Environment Variables (Optional)

For production deployments, you can use environment variables:

### .env.local (create this file)
```bash
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### Update firebase.ts
```typescript
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};
```

### .gitignore (add this line)
```
.env.local
```

**Note**: Environment variables are optional. Hard-coding values in `firebase.ts` is fine for client-side Firebase apps.

## Testing Your Configuration

After updating `src/utils/firebase.ts`:

1. **Save the file**
2. **Restart development server** (Ctrl+C, then `npm start`)
3. **Open browser console** (F12)
4. **Look for errors**:
   - ✅ No errors = Configuration correct
   - ❌ "Firebase: Error (auth/api-key-not-valid-please-pass-a-valid-api-key)" = Check apiKey
   - ❌ "Firebase: Error (app/invalid-credential)" = Check all credentials

5. **Test cloud sync**:
   - Toggle "Enable Cloud Sync" ON
   - Click "Upload to Cloud"
   - Check Firebase Console → Firestore Database
   - See your schools in the "schools" collection

## Troubleshooting

### Error: "Firebase: Error (auth/api-key-not-valid-please-pass-a-valid-api-key)"
**Solution**: 
- Copy apiKey again from Firebase Console
- Make sure there are no extra spaces
- Verify it starts with "AIza"

### Error: "Firebase: Error (app/invalid-credential)"
**Solution**: 
- Verify all credentials are from the same Firebase project
- Copy the entire config object again
- Don't mix credentials from different projects

### Error: "Firebase: Firebase App named '[DEFAULT]' already exists"
**Solution**: 
- You initialized Firebase twice
- Remove duplicate initialization
- Only call `initializeApp()` once

### No Error But Not Working
**Solution**: 
1. Check Firestore is enabled in Firebase Console
2. Verify Security Rules allow read/write
3. Check browser console for silent errors
4. Try manual Firebase Console write to test rules

## Next Steps

After configuring Firebase:

1. ✅ Update `src/utils/firebase.ts` with your credentials
2. ✅ Save and restart development server
3. ✅ Test cloud sync functionality
4. ✅ Configure Firestore Security Rules
5. ✅ (Optional) Enable Authentication
6. ✅ Read [CLOUD_SYNC_USER_GUIDE.md](./CLOUD_SYNC_USER_GUIDE.md)
7. ✅ Complete [CLOUD_SYNC_TESTING_CHECKLIST.md](./CLOUD_SYNC_TESTING_CHECKLIST.md)

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Quickstart](https://firebase.google.com/docs/firestore/quickstart)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Console](https://console.firebase.google.com/)

---

**Need help?** Check the troubleshooting section in [FIREBASE_SETUP_GUIDE.md](./FIREBASE_SETUP_GUIDE.md)
