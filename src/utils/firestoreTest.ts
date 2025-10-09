/**
 * Firestore Connection Test
 * Add this temporarily to diagnose the exact error
 */

import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

export async function testFirestoreConnection() {
  console.log("🔍 Testing Firestore connection...");

  try {
    // Test 1: Try to read from schools collection
    console.log("Test 1: Reading from 'schools' collection...");
    const schoolsRef = collection(db, "schools");
    const snapshot = await getDocs(schoolsRef);
    console.log("✅ Read successful! Found", snapshot.size, "schools");

    snapshot.forEach((doc) => {
      console.log("  School:", doc.id, doc.data());
    });

    // Test 2: Try to write a test document
    console.log("\nTest 2: Writing test document...");
    const testRef = doc(db, "schools", "TEST_SCHOOL");
    await setDoc(testRef, {
      name: "Test School",
      baseUrl: "https://test.com",
      createdAt: new Date(),
    });
    console.log("✅ Write successful!");

    return { success: true, message: "All tests passed!" };
  } catch (error: any) {
    console.error("❌ Firestore test failed:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);

    // Provide specific guidance based on error
    if (error.code === "permission-denied") {
      console.error(`
❌ PERMISSION DENIED
      
Your Firestore Security Rules are blocking access.

Fix:
1. Go to: https://console.firebase.google.com/project/education-app-manager/firestore/rules
2. Click "Rules" tab
3. Replace with:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /schools/{schoolId} {
      allow read, write: if true;
    }
  }
}

4. Click "Publish"
5. Wait 10 seconds
6. Refresh your app
      `);
    } else if (error.code === "failed-precondition") {
      console.error(`
❌ FIRESTORE NOT ENABLED

Firestore database is not enabled in your Firebase project.

Fix:
1. Go to: https://console.firebase.google.com/project/education-app-manager/firestore
2. Click "Create database"
3. Choose "Start in test mode"
4. Select a location (e.g., us-central1)
5. Click "Enable"
6. Wait 60 seconds
7. Refresh your app
      `);
    } else if (error.code === "unavailable") {
      console.error(`
❌ NETWORK ERROR

Cannot connect to Firestore servers.

Fix:
- Check your internet connection
- Try disabling VPN/proxy
- Check firewall settings
      `);
    }

    return { success: false, error: error.message, code: error.code };
  }
}
