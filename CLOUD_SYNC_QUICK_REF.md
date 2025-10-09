# ☁️ Cloud Sync Quick Reference

## 🚀 Quick Setup (5 Minutes)

1. **Firebase Console**: https://console.firebase.google.com
2. **Create Project** → Add Web App
3. **Copy Config** → Paste in `src/utils/firebase.ts`
4. **Enable Firestore** → Create Database
5. **Set Rules** → Use Option A from setup guide
6. **Done!** ✅

## 🎮 Quick Controls

| Button | Action | When to Use |
|--------|--------|-------------|
| 🔄 **Toggle ON** | Enable real-time sync | Daily use |
| 🔄 **Toggle OFF** | Disable real-time sync | Working offline |
| 🟣 **Upload** | Send schools to cloud | First time, backup |
| 🟢 **Download** | Get schools from cloud | New device, restore |

## 💡 Common Workflows

### First Time
```
Device 1: Add Schools → Toggle ON → Upload ✓
Device 2: Toggle ON → Download ✓
```

### Daily Use
```
All Devices: Toggle ON (once)
Then: Add/Delete normally → Auto sync! 🚀
```

### Offline Work
```
Toggle OFF → Add/Delete schools → Back online → Toggle ON → Upload
```

### Share with Team
```
Everyone: Same Firebase config → Toggle ON → Auto sync! 👥
```

## ⚡ Key Points

✅ **DO**:
- Toggle ON for automatic sync
- Upload before switching devices
- Download when first opening on new device

❌ **DON'T**:
- Share Firebase config publicly (if private mode)
- Delete without backup
- Expect sync to work offline

## 🆘 Troubleshooting

| Problem | Quick Fix |
|---------|-----------|
| Not syncing | Toggle OFF → ON |
| Upload disabled | Add a custom school first |
| Permission error | Check Firestore rules |
| Offline error | Check internet connection |

## 📚 Full Documentation

- **Setup**: [FIREBASE_SETUP_GUIDE.md](./FIREBASE_SETUP_GUIDE.md)
- **Usage**: [CLOUD_SYNC_USER_GUIDE.md](./CLOUD_SYNC_USER_GUIDE.md)
- **Main**: [README.md](./README.md)

## 🎯 What Gets Synced?

✅ Custom schools (name, URLs)  
❌ Built-in schools  
❌ Selected school/app  
❌ Language preference  

## 🔒 Security Options

**Test Mode** (30 days): Anyone can read/write  
**Public**: Anyone with link can access  
**Read-Only**: Anyone reads, only you write  
**Private**: Only authenticated users  

## 📊 Firebase Free Tier

- 1 GB storage (≈ 1 million schools)
- 50K reads/day
- 20K writes/day
- **More than enough for personal use!** 🎉

## 🌐 Cross-Device Support

✅ Windows, Mac, Linux  
✅ Chrome, Firefox, Edge, Safari  
✅ iOS (Safari), Android (Chrome)  
✅ Tablets, Phones, Desktops  

## 🔄 Sync Speed

- **Upload**: ~1 second per 10 schools
- **Download**: ~1 second per 10 schools
- **Real-time**: Instant (< 1 second)

## 💾 Backup Methods

**Cloud**: Upload to Firebase (primary)  
**Local**: localStorage (automatic)  
**Manual**: Console → `localStorage.getItem('customSchools')`

## 🎨 UI Guide

**Blue Box**: Cloud Sync section  
**Toggle**: Enable/Disable sync  
**Purple Button**: Upload to cloud  
**Green Button**: Download from cloud  
**Green Message**: Success  
**Red Message**: Error  

## 📞 Need Help?

1. Check error message in app
2. Open Console (F12) for details
3. Review [setup guide](./FIREBASE_SETUP_GUIDE.md)
4. Check Firebase Console → Firestore
5. Verify internet connection

---

**🎉 That's it! Your schools are now accessible from any device!**
