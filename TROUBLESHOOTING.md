# 🔧 Cloud Sync Troubleshooting Guide

## Common Error: "❌ Sync error. Check your connection."

This error appears when the app cannot connect to Firebase Firestore. Here are the most common causes and solutions:

---

## ✅ Step-by-Step Troubleshooting

### Step 1: Check if Firestore Database is Enabled

**Problem:** Firestore database is not created/enabled in Firebase Console

**How to Check:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **education-app-manager**
3. Look in the left sidebar for **"Firestore Database"**
4. Click on it

**What you should see:**

- ✅ **If database exists**: You'll see a list of collections (or empty database)
- ❌ **If database doesn't exist**: You'll see a button "Create database"

**Solution if database doesn't exist:**

1. Click **"Create database"**
2. Select **"Start in test mode"** (for now)
3. Choose a location (e.g., us-central1)
4. Click **"Enable"**
5. Wait 30-60 seconds for creation
6. Try syncing again in your app

---

### Step 2: Check Firestore Security Rules

**Problem:** Security rules are blocking read/write access

**How to Check:**

1. Firebase Console → Firestore Database
2. Click the **"Rules"** tab
3. Look at the current rules

**What you should see:**

**❌ BAD (Blocks everything):**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;  // ❌ Blocks all access
    }
  }
}
```

**✅ GOOD (Test mode - allows everything):**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // ✅ Allows all access
    }
  }
}
```

**Or better yet (School-specific rules):**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /schools/{schoolId} {
      allow read, write: if true;  // ✅ Allows access to schools collection
    }
  }
}
```

**Solution:**

1. Click **"Rules"** tab
2. Replace with one of the GOOD rules above
3. Click **"Publish"**
4. Wait 10 seconds
5. Try syncing again

---

### Step 3: Check Internet Connection

**Problem:** No internet connection or firewall blocking Firebase

**How to Check:**

1. Open browser console (F12)
2. Go to **Network** tab
3. Try syncing in your app
4. Look for requests to `firestore.googleapis.com`

**What you should see:**

- ✅ Request to `firestore.googleapis.com` with status 200 or 403
- ❌ Request fails with "net::ERR_INTERNET_DISCONNECTED"
- ❌ Request blocked by CORS or firewall

**Solution:**

- Check your WiFi/internet connection
- Try a different network
- Disable VPN/proxy if using one
- Check firewall settings (allow firestore.googleapis.com)

---

### Step 4: Check Browser Console for Detailed Errors

**How to Check:**

1. Open your app
2. Press **F12** to open Developer Tools
3. Click **Console** tab
4. Try syncing (click Upload or Download)
5. Look for error messages

**Common Errors and Solutions:**

#### Error: "Missing or insufficient permissions"

```
FirebaseError: Missing or insufficient permissions.
```

**Solution:** Fix Firestore Security Rules (see Step 2)

#### Error: "Firebase: Error (auth/api-key-not-valid-please-pass-a-valid-api-key)"

```
Firebase: Error (auth/api-key-not-valid-please-pass-a-valid-api-key)
```

**Solution:** Check your API key in `src/utils/firebase.ts`

#### Error: "Failed to get document because the client is offline"

```
FirebaseError: Failed to get document because the client is offline.
```

**Solution:** Check internet connection

#### Error: "Firebase: No Firebase App '[DEFAULT]' has been created"

```
Firebase: No Firebase App '[DEFAULT]' has been created
```

**Solution:** Firebase not initialized properly. Check `src/utils/firebase.ts`

---

### Step 5: Verify Firebase Configuration

**Check your firebase.ts file:**

1. Open: `src/utils/firebase.ts`
2. Verify all values are filled in (no "YOUR\_..." placeholders)
3. Check these values:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyD6sJOd2uwWM72yrF3L-9eOeMANJXqK_Fg", // ✅ Starts with "AIza"
  authDomain: "education-app-manager.firebaseapp.com", // ✅ Ends with ".firebaseapp.com"
  projectId: "education-app-manager", // ✅ Your project ID
  storageBucket: "education-app-manager.firebasestorage.app", // ✅ Ends with storage domain
  messagingSenderId: "1066913226439", // ✅ 12-digit number
  appId: "1:1066913226439:web:5bbbb2cfface59748ba8e2", // ✅ Proper format
};
```

**Your configuration looks correct! ✅**

---

### Step 6: Test Firebase Connection Directly

**Quick Test in Browser Console:**

1. Open your app
2. Press F12 → Console tab
3. Paste this code:

```javascript
// Test if db is initialized
console.log("DB initialized:", window.db !== undefined);

// Test Firestore connection
import { collection, getDocs } from "firebase/firestore";
getDocs(collection(window.db, "schools"))
  .then((snapshot) => {
    console.log("✅ Firestore connected! Schools:", snapshot.size);
  })
  .catch((error) => {
    console.error("❌ Firestore error:", error.message);
  });
```

**Expected Results:**

- ✅ "Firestore connected! Schools: X" → Working!
- ❌ "permission-denied" → Fix security rules
- ❌ "offline" → Check internet
- ❌ "not-found" → Enable Firestore database

---

## 🎯 Quick Fix Checklist

Work through this checklist in order:

- [ ] **Step 1**: Is Firestore Database created in Firebase Console?

  - [ ] Yes → Go to Step 2
  - [ ] No → Create database (test mode), wait 60 seconds, try again

- [ ] **Step 2**: Are Security Rules set to allow access?

  - [ ] Check Rules tab in Firestore
  - [ ] Set to test mode: `allow read, write: if true;`
  - [ ] Publish rules, wait 10 seconds, try again

- [ ] **Step 3**: Is internet connection working?

  - [ ] Test: Can you access google.com?
  - [ ] Check browser Network tab for blocked requests

- [ ] **Step 4**: Check browser console errors

  - [ ] F12 → Console tab
  - [ ] Look for Firebase errors
  - [ ] Follow specific error solutions above

- [ ] **Step 5**: Restart development server
  - [ ] Ctrl+C to stop
  - [ ] `npm start` or `bun run dev` to restart
  - [ ] Clear browser cache (Ctrl+Shift+R)

---

## 🔍 Advanced Debugging

### Enable Verbose Logging

Add this to the top of `src/utils/schoolSync.ts`:

```typescript
// Add after imports
const DEBUG = true;
const log = (...args: any[]) => {
  if (DEBUG) console.log("[SchoolSync]", ...args);
};
```

Then add logging to each method:

```typescript
static async getAllSchools(): Promise<Record<string, SchoolConfig>> {
  log('Getting all schools from cloud...');
  try {
    const schoolsRef = collection(db, SCHOOLS_COLLECTION);
    log('Collection reference created');

    const querySnapshot = await getDocs(schoolsRef);
    log('Query snapshot received:', querySnapshot.size, 'documents');

    const schools: Record<string, SchoolConfig> = {};
    querySnapshot.forEach((doc) => {
      log('Processing document:', doc.id);
      const data = doc.data();
      schools[doc.id] = {
        name: data.name,
        baseUrl: data.baseUrl,
      };
    });

    log('✅ Successfully retrieved', Object.keys(schools).length, 'schools');
    return schools;
  } catch (error) {
    log('❌ Error:', error);
    throw error;
  }
}
```

### Check Firestore Dashboard

1. Go to Firebase Console → Firestore Database
2. Look at the **Data** tab
3. You should see:
   - Collection: `schools`
   - Documents: Your school keys (e.g., CustomSchool1)
   - Fields: name, baseUrl, etc.

If you don't see this, schools haven't been uploaded yet.

---

## 🚀 Most Likely Solution

Based on your error, the **most likely cause** is:

### **Firestore Database Not Enabled Yet**

**Quick Fix:**

1. Go to: https://console.firebase.google.com/project/education-app-manager/firestore
2. If you see **"Create database"** button:
   - Click it
   - Choose "Start in test mode"
   - Select location: us-central1 (or closest to you)
   - Click "Enable"
   - Wait 60 seconds
3. Try syncing again in your app

**Or Security Rules Too Restrictive:**

1. Go to: https://console.firebase.google.com/project/education-app-manager/firestore/rules
2. Replace rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /schools/{schoolId} {
      allow read, write: if true;
    }
  }
}
```

3. Click "Publish"
4. Wait 10 seconds
5. Try syncing again

---

## 📝 What to Do Next

1. **Follow Quick Fix Checklist above** (most important!)
2. **Check browser console** for specific error messages
3. **Verify Firestore is enabled** in Firebase Console
4. **Check Security Rules** are not blocking access
5. **Test internet connection** is working

After fixing, you should see:

- ✅ "Successfully synced to cloud!" (green message)
- ✅ Data appears in Firebase Console → Firestore Database
- ✅ Can download data on another device/browser

---

## 💬 Still Having Issues?

If you've tried everything above and still getting errors:

1. **Share the exact error from browser console** (F12 → Console)
2. **Check Firebase Console → Firestore Database** - is it enabled?
3. **Check Firebase Console → Firestore Rules** - what do they say?
4. **Check Network tab** - any failed requests?

Common final solutions:

- Wait a few minutes (Firebase sometimes takes time to propagate)
- Clear browser cache completely
- Try in incognito/private window
- Restart development server
- Check if you need to enable Firebase Authentication

---

## ✅ Success Indicators

You'll know it's working when:

1. ✅ Browser console shows: "Firebase initialized successfully"
2. ✅ Browser console shows: "Firestore initialized successfully"
3. ✅ Clicking "Upload to Cloud" shows green success message
4. ✅ Firebase Console → Firestore Database shows "schools" collection
5. ✅ Documents appear in Firebase Console with your school data
6. ✅ Clicking "Download from Cloud" retrieves the schools
7. ✅ No errors in browser console

**Good luck! The most common fix is enabling Firestore Database in Firebase Console.** 🎉
