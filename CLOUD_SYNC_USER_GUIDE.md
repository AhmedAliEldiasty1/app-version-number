# Cloud Sync Feature User Guide

## Overview

The Cloud Sync feature allows you to access your custom school list from any device or computer. Your schools are stored in the cloud and automatically synchronized across all your devices in real-time.

## Quick Start

1. **Setup** (one-time): Follow the [Firebase Setup Guide](./FIREBASE_SETUP_GUIDE.md)
2. **Enable**: Toggle "Enable Cloud Sync" to ON
3. **Upload**: Click "Upload to Cloud" to save your schools
4. **Use on other devices**: Open the app, toggle ON, click "Download from Cloud"

## Features

### 🔄 Real-Time Synchronization

When enabled, all changes sync automatically across devices:

- **Add a school** on your laptop → Appears on your phone instantly
- **Delete a school** on your tablet → Disappears on all devices
- **No manual sync needed** → Just toggle ON and it works!

### ☁️ Manual Sync Controls

You have full control with manual buttons:

#### Upload to Cloud (Purple Button)
- **What it does**: Saves all your custom schools to Firebase
- **When to use**:
  - First time setup
  - After adding many schools offline
  - To backup your current list
- **Behavior**: 
  - Merges with existing cloud data
  - Doesn't delete schools already in cloud
  - Disabled when you have no custom schools

#### Download from Cloud (Green Button)
- **What it does**: Fetches all schools from Firebase
- **When to use**:
  - First time on a new device
  - After someone else added schools
  - To restore from cloud backup
- **Behavior**:
  - Merges with your local schools
  - Doesn't delete your local schools
  - Updates existing schools with cloud version

### 🎛️ Enable/Disable Toggle

**ON (Enabled)**:
- ✅ Real-time sync active
- ✅ Changes sync automatically
- ✅ Listens for updates from other devices
- ⚡ Uses internet connection

**OFF (Disabled)**:
- ❌ Real-time sync inactive
- ✅ Manual buttons still work
- ✅ Schools saved locally (localStorage)
- 💾 Works offline

## Usage Scenarios

### Scenario 1: First Time Setup

**On Your First Device:**
1. Add your custom schools normally
2. Toggle "Enable Cloud Sync" to ON
3. Click "Upload to Cloud"
4. ✅ Success! Your schools are in the cloud

**On Your Other Devices:**
1. Open the app
2. Toggle "Enable Cloud Sync" to ON
3. Click "Download from Cloud"
4. ✅ Success! All schools appear

### Scenario 2: Daily Use (Automatic Sync)

1. Toggle "Enable Cloud Sync" to ON (on all devices)
2. Add/delete schools normally on any device
3. Changes appear automatically on other devices
4. No need to click Upload/Download buttons

### Scenario 3: Working Offline

1. Toggle "Enable Cloud Sync" to OFF
2. Add/delete schools as usual
3. Schools are saved locally (localStorage)
4. When back online:
   - Toggle ON
   - Click "Upload to Cloud"
   - Your changes are synced

### Scenario 4: Sharing with Team

**Setup:**
- All team members follow [Firebase Setup Guide](./FIREBASE_SETUP_GUIDE.md)
- Everyone uses the same Firebase project configuration
- Set Security Rules to allow read/write for all

**Usage:**
- Each person adds schools from their device
- Everyone sees all schools in real-time
- Perfect for school management teams!

### Scenario 5: Backup & Restore

**Backup:**
1. Toggle "Enable Cloud Sync" to ON
2. Click "Upload to Cloud"
3. ✅ Your schools are backed up in Firebase

**Restore:**
1. Open app on new device
2. Toggle "Enable Cloud Sync" to ON
3. Click "Download from Cloud"
4. ✅ All schools restored

## Understanding Sync Behavior

### Merge Logic

Cloud sync **merges** data rather than replacing:

**Example 1: Upload**
- Local schools: School A, School B
- Cloud schools: School C
- After upload: School A, School B, School C (in cloud)

**Example 2: Download**
- Local schools: School A, School B
- Cloud schools: School C, School D
- After download: School A, School B, School C, School D (locally)

**Example 3: Conflict**
- Local: School A (URL: http://old.com)
- Cloud: School A (URL: http://new.com)
- After download: School A (URL: http://new.com) ← Cloud version wins

### What Gets Synced

**Synced:**
- ✅ Custom schools you added
- ✅ School name
- ✅ Student API URL
- ✅ Parent API URL
- ✅ Teacher API URL

**NOT Synced:**
- ❌ Built-in schools (AlQalam, Alwelan, Alaqlam, etc.)
- ❌ Selected school
- ❌ Selected app type
- ❌ Active tab
- ❌ Language preference

## Status Messages

### Success Messages (Green)

**"Successfully synced to cloud!"**
- ✅ Upload completed successfully
- All schools are now in Firebase

**"Successfully synced from cloud!"**
- ✅ Download completed successfully
- All cloud schools are now local

**"Cloud sync enabled"**
- ✅ Real-time sync is now active
- Changes will sync automatically

**"Cloud sync disabled"**
- ℹ️ Real-time sync is now inactive
- Manual buttons still work

### Error Messages (Red)

**"Error syncing to cloud: [details]"**
- ❌ Upload failed
- Common causes:
  - No internet connection
  - Firebase config incorrect
  - Firestore not enabled
- Solution: Check error details, verify setup

**"Error syncing from cloud: [details]"**
- ❌ Download failed
- Common causes:
  - No internet connection
  - No data in cloud yet
  - Permission denied (check security rules)
- Solution: Check error details, verify setup

## Tips & Best Practices

### ✅ DO:
- Enable cloud sync on all your devices
- Upload before switching devices
- Download when first opening on a new device
- Keep cloud sync enabled for automatic updates
- Upload after making many changes

### ❌ DON'T:
- Don't share your Firebase config publicly (if using private security rules)
- Don't delete from cloud unless you're sure
- Don't disable sync if you want automatic updates
- Don't modify Firebase database directly (use the app)

## Troubleshooting

### Changes don't sync between devices

**Check:**
1. Is "Enable Cloud Sync" toggled ON on both devices?
2. Do both devices have internet connection?
3. Did you upload from first device before downloading on second?
4. Check browser console (F12) for error messages

**Solution:**
- Toggle OFF then ON to restart sync
- Manually click "Upload to Cloud" then "Download from Cloud"
- Verify Firebase setup is correct

### Upload button is disabled

**Cause:** You don't have any custom schools yet

**Solution:**
- Add at least one custom school using the "Add School" button
- Upload button will become enabled automatically

### "Permission denied" error

**Cause:** Firestore Security Rules are too restrictive

**Solution:**
- Check Firebase Console → Firestore → Rules
- Verify rules allow read/write access
- See [Firebase Setup Guide](./FIREBASE_SETUP_GUIDE.md) Step 5

### Data appears but then disappears

**Cause:** Real-time sync is overwriting your data

**Solution:**
- This means someone else deleted it from another device
- Or you have conflicting data between devices
- Upload your local data to restore it

### Slow sync performance

**Cause:** Many schools or slow internet

**Solution:**
- Cloud sync is fast for normal use (<100 schools)
- Check your internet connection speed
- Consider disabling real-time sync if not needed
- Use manual Upload/Download instead

## Data Privacy & Security

### Your Data
- Stored in Google Firebase (secure Google servers)
- Encrypted in transit (HTTPS)
- Encrypted at rest (Firebase default)
- Subject to Firebase security rules you set

### Privacy Options

**Public (Option A in setup guide):**
- Anyone with Firebase config can read/write
- Good for: Small teams, shared school lists
- Not recommended for: Sensitive school data

**Read-Only for Others (Option B):**
- Anyone can read, only you can write
- Requires: Firebase Authentication
- Good for: Publishing school lists

**Private (Option C):**
- Only authenticated users can read/write
- Requires: Firebase Authentication
- Good for: Personal use, sensitive data

### Best Practices
- Use Option B or C for production
- Don't share Firebase config publicly if using private mode
- Regularly backup your data
- Monitor Firebase Console for unexpected access

## Technical Details

### Storage Location
- Collection: `schools`
- Document ID: School key (e.g., "CustomSchool1")
- Document Fields:
  ```json
  {
    "name": "School Name",
    "studentUrl": "https://...",
    "parentUrl": "https://...",
    "teacherUrl": "https://..."
  }
  ```

### Local Storage
- Key: `customSchools`
- Format: JSON string
- Backup: Automatically saved locally
- Cleared: Only when you clear browser data

### Network Usage
- Real-time sync: ~1KB per change
- Upload: ~1KB per school
- Download: ~1KB per school
- Free tier: 50K reads + 20K writes per day

### Browser Compatibility
- ✅ Chrome, Edge, Firefox, Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Android)
- ❌ Internet Explorer (not supported)

## FAQ

**Q: Does cloud sync work offline?**  
A: Manual buttons require internet. Real-time sync requires internet. Local storage works offline.

**Q: Can I use cloud sync without Firebase?**  
A: No, Firebase is required for cloud sync. Alternative: Use localStorage (works offline but no sync).

**Q: How much does Firebase cost?**  
A: Firebase has a generous free tier (1GB storage, 50K reads/day, 20K writes/day). For this app, free tier is more than enough for personal/small team use.

**Q: Can I sync with multiple Firebase projects?**  
A: You can only use one Firebase project at a time. To switch, update `src/utils/firebase.ts` with new config.

**Q: What happens if I delete a school on one device?**  
A: If cloud sync is enabled, it will be deleted from cloud and all connected devices automatically. If not enabled, only deleted locally.

**Q: Can I recover deleted schools?**  
A: No automatic recovery. Best practice: Upload before making major deletions as a backup.

**Q: How many schools can I sync?**  
A: Firebase free tier allows 1GB storage. Each school ~1KB = ~1 million schools (practically unlimited).

**Q: Does cloud sync affect app performance?**  
A: Minimal impact. Real-time sync uses efficient WebSocket connection. Initial download depends on number of schools.

**Q: Can I see sync history?**  
A: Not in the app. You can view Firestore Database in Firebase Console to see all schools and when they were last updated.

## Support

For technical issues:
1. Check browser console (F12) for errors
2. Verify Firebase setup is correct
3. Check [Firebase Setup Guide](./FIREBASE_SETUP_GUIDE.md)
4. Review Firestore Security Rules
5. Check Firebase Console for database status

For feature requests or bugs:
- Create an issue in the project repository
- Include error messages and steps to reproduce

## Summary

Cloud Sync makes your school list accessible everywhere:
- ☁️ **Cloud Storage**: Schools stored in Firebase
- 🔄 **Real-Time Sync**: Changes appear instantly
- 🎛️ **Manual Control**: Upload/Download buttons
- 🔒 **Secure**: Firestore security rules
- 🆓 **Free**: Firebase free tier is generous
- 📱 **Cross-Device**: Works on phones, tablets, computers

**Get started**: Follow [Firebase Setup Guide](./FIREBASE_SETUP_GUIDE.md) → Toggle ON → Upload → Download on other devices → Done! 🎉
