# Firebase Setup Guide for Cloud Sync

This guide will help you set up Firebase to enable cloud synchronization for your school list across different devices and computers.

## Prerequisites

- Google Account
- Firebase SDK already installed ✅

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "Education App Manager")
4. (Optional) Enable Google Analytics
5. Click **"Create project"**
6. Wait for project creation to complete
7. Click **"Continue"**

## Step 2: Register Web App

1. In your Firebase project dashboard, click the **Web icon** `</>`
2. Enter an app nickname (e.g., "School Version Manager")
3. **Do NOT** check "Also set up Firebase Hosting" (unless you want to host it)
4. Click **"Register app"**
5. You'll see a configuration object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop",
};
```

6. **Copy this entire configuration object**
7. Click **"Continue to console"**

## Step 3: Update Your Code

1. Open the file: `src/utils/firebase.ts`
2. Find the placeholder configuration:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

3. **Replace it with your actual configuration** from Step 2
4. Save the file

## Step 4: Enable Firestore Database

1. In Firebase Console, click **"Firestore Database"** in the left menu
2. Click **"Create database"**
3. Select **"Start in test mode"** (we'll secure it in the next step)
4. Choose a Firestore location (pick the closest to you):
   - `us-central1` (Iowa, USA)
   - `europe-west1` (Belgium)
   - `asia-south1` (Mumbai, India)
   - etc.
5. Click **"Enable"**
6. Wait for database creation (takes ~30 seconds)

## Step 5: Set Security Rules

⚠️ **IMPORTANT**: By default, test mode allows anyone to read/write your database for 30 days. You should secure it!

### Option A: Public Read/Write (Simple but Less Secure)

Use this if you want to allow anyone with the link to access the schools.

1. In Firestore Database, click the **"Rules"** tab
2. Replace the rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /schools/{schoolId} {
      allow read, write: if true;
    }
  }
}
```

3. Click **"Publish"**

### Option B: Read-Only for Others (Recommended)

Use this if you want only you to add/edit schools, but others can view them.

1. In Firestore Database, click the **"Rules"** tab
2. Replace the rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /schools/{schoolId} {
      // Anyone can read
      allow read: if true;
      // Only you can write (requires authentication - see Step 6)
      allow write: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

### Option C: Private (Most Secure)

Use this if you want complete privacy (requires authentication).

1. In Firestore Database, click the **"Rules"** tab
2. Replace the rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /schools/{schoolId} {
      // Only authenticated users can read/write
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**
4. **You must complete Step 6** to enable authentication

## Step 6: Enable Authentication (Optional - for Option B/C)

If you chose Option B or C above, you need to enable authentication:

1. In Firebase Console, click **"Authentication"** in the left menu
2. Click **"Get started"**
3. Click the **"Sign-in method"** tab
4. Enable **"Anonymous"** authentication:
   - Click on "Anonymous"
   - Toggle **"Enable"**
   - Click **"Save"**

This allows users to authenticate without creating accounts, but still provides security.

**Note**: For full private mode (Option C), you may want to enable other methods like Google Sign-In or Email/Password. This requires additional code changes.

## Step 7: Test Your Setup

1. Start your development server:

   ```bash
   npm start
   # or
   bun run dev
   ```

2. Open your app in a browser

3. You should see the **Cloud Sync** section (blue gradient box)

4. Toggle **"Enable Cloud Sync"** to ON

5. If you have custom schools, click **"Upload to Cloud"**

   - You should see "Successfully synced to cloud!"
   - Check Firebase Console → Firestore Database to see your data

6. Open your app in a different browser or device

7. Toggle **"Enable Cloud Sync"** to ON

8. Click **"Download from Cloud"**
   - You should see your schools appear!

## Troubleshooting

### Error: "Firebase: Error (auth/api-key-not-valid-please-pass-a-valid-api-key)"

- **Solution**: Double-check that you copied the correct `apiKey` from Firebase Console
- Make sure there are no extra spaces or quotes

### Error: "Missing or insufficient permissions"

- **Solution**: Check your Firestore Security Rules (Step 5)
- If using Option B/C, make sure Authentication is enabled (Step 6)

### Error: "Failed to get document because the client is offline"

- **Solution**: Check your internet connection
- Firebase requires an active internet connection to sync

### No errors but data doesn't sync

1. Open browser console (F12) and check for errors
2. Verify Firestore Database is enabled in Firebase Console
3. Check that `src/utils/firebase.ts` has your correct configuration
4. Make sure you clicked "Upload to Cloud" before "Download from Cloud"

### Data syncs but doesn't update in real-time

- Make sure **"Enable Cloud Sync"** toggle is ON
- Real-time sync only works when the toggle is enabled
- Try disabling and re-enabling the toggle

## How to Use Cloud Sync

### Enable Cloud Sync

1. Toggle **"Enable Cloud Sync"** to ON
2. This enables real-time synchronization
3. Changes will automatically sync across devices

### Upload Schools to Cloud

1. Click **"Upload to Cloud"** button (purple)
2. All your custom schools will be saved to Firebase
3. You'll see a success message

### Download Schools from Cloud

1. Click **"Download from Cloud"** button (green)
2. All schools from Firebase will be downloaded
3. They'll merge with your local schools
4. You'll see a success message

### Automatic Sync

- When "Enable Cloud Sync" is ON, changes sync automatically
- Add a school on Device A → It appears on Device B instantly
- Delete a school on Device B → It disappears on Device A instantly

## Data Privacy & Security

- **API Key**: The `apiKey` in your config is safe to expose publicly (it's not a secret)
- **Security Rules**: Firestore Security Rules protect your data (Step 5)
- **Authentication**: Anonymous auth provides basic security without requiring user accounts
- **Data Storage**: Your data is stored on Google's secure Firebase servers
- **Free Tier**: Firebase offers 1GB storage + 50K reads/day + 20K writes/day for FREE

## Backup Your Data

Even with cloud sync, it's good to have backups:

1. Open browser console (F12)
2. Type: `localStorage.getItem('customSchools')`
3. Copy the output and save it to a text file
4. To restore: `localStorage.setItem('customSchools', 'YOUR_COPIED_DATA')`

## Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Console](https://console.firebase.google.com/)

## Summary Checklist

- [ ] Create Firebase project
- [ ] Register web app
- [ ] Copy configuration to `src/utils/firebase.ts`
- [ ] Enable Firestore Database
- [ ] Set Security Rules
- [ ] (Optional) Enable Authentication
- [ ] Test upload/download functionality
- [ ] Enable real-time sync
- [ ] Test on multiple devices

**Congratulations! Your cloud sync is now set up! 🎉**
