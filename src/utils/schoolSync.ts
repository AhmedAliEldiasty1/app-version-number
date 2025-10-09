import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { rateLimitedOperation } from "./rateLimit";

export interface SchoolConfig {
  name: string;
  baseUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const SCHOOLS_COLLECTION = "schools";

/**
 * Cloud School Sync Service
 * Syncs custom schools across devices using Firebase Firestore
 */
// Keep track of active subscription
let activeSubscription: (() => void) | null = null;

export class SchoolSyncService {
  /**
   * Save a school to the cloud with rate limiting and retries
   */
  static async saveSchool(key: string, config: SchoolConfig): Promise<void> {
    return rateLimitedOperation(async () => {
      try {
        const schoolRef = doc(db, SCHOOLS_COLLECTION, key);
        await setDoc(schoolRef, {
          ...config,
          updatedAt: Timestamp.now(),
          createdAt: Timestamp.now(),
        });
      } catch (error) {
        console.error("Error saving school to cloud:", error);
        throw error;
      }
    });
  }

  /**
   * Get a specific school from the cloud
   */
  static async getSchool(key: string): Promise<SchoolConfig | null> {
    try {
      const schoolRef = doc(db, SCHOOLS_COLLECTION, key);
      const schoolSnap = await getDoc(schoolRef);

      if (schoolSnap.exists()) {
        const data = schoolSnap.data();
        return {
          name: data.name,
          baseUrl: data.baseUrl,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        };
      }
      return null;
    } catch (error) {
      console.error("Error getting school from cloud:", error);
      throw new Error("Failed to get school from cloud");
    }
  }

  /**
   * Get all schools from the cloud
   */
  static async getAllSchools(): Promise<Record<string, SchoolConfig>> {
    try {
      const schoolsRef = collection(db, SCHOOLS_COLLECTION);
      const querySnapshot = await getDocs(schoolsRef);

      const schools: Record<string, SchoolConfig> = {};
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        schools[doc.id] = {
          name: data.name,
          baseUrl: data.baseUrl,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        };
      });

      return schools;
    } catch (error) {
      console.error("Error getting all schools from cloud:", error);
      throw new Error("Failed to get schools from cloud");
    }
  }

  /**
   * Delete a school from the cloud
   */
  static async deleteSchool(key: string): Promise<void> {
    try {
      const schoolRef = doc(db, SCHOOLS_COLLECTION, key);
      await deleteDoc(schoolRef);
    } catch (error) {
      console.error("Error deleting school from cloud:", error);
      throw new Error("Failed to delete school from cloud");
    }
  }

  /**
   * Sync local schools to cloud
   */
  static async syncToCloud(
    localSchools: Record<string, SchoolConfig>
  ): Promise<void> {
    return rateLimitedOperation(async () => {
      try {
        // First get current cloud schools to handle deletions
        const cloudSchools = await this.getAllSchools();

        // Find schools to delete (in cloud but not in local)
        const schoolsToDelete = Object.keys(cloudSchools).filter(
          (key) => !localSchools[key]
        );

        // Find schools to save/update (in local)
        const schoolsToSave = Object.entries(localSchools);

        // Process in batches to avoid rate limits
        const batchSize = 5;

        // Delete in batches
        for (let i = 0; i < schoolsToDelete.length; i += batchSize) {
          const batch = schoolsToDelete.slice(i, i + batchSize);
          await Promise.all(batch.map((key) => this.deleteSchool(key)));
          if (i + batchSize < schoolsToDelete.length) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }

        // Save in batches
        for (let i = 0; i < schoolsToSave.length; i += batchSize) {
          const batch = schoolsToSave.slice(i, i + batchSize);
          await Promise.all(
            batch.map(([key, config]) => this.saveSchool(key, config))
          );
          if (i + batchSize < schoolsToSave.length) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }
      } catch (error) {
        console.error("Error syncing to cloud:", error);
        throw error;
      }
    });
  }

  /**
   * Subscribe to real-time updates with singleton pattern
   */
  static subscribeToSchools(
    callback: (schools: Record<string, SchoolConfig>) => void
  ): () => void {
    // If there's an active subscription, unsubscribe first
    if (activeSubscription) {
      console.log("Cleaning up existing subscription");
      activeSubscription();
      activeSubscription = null;
    }

    console.log("Setting up new subscription");
    const schoolsRef = collection(db, SCHOOLS_COLLECTION);

    const unsubscribe = onSnapshot(
      schoolsRef,
      {
        includeMetadataChanges: false, // Only get actual data changes
      },
      (snapshot) => {
        const schools: Record<string, SchoolConfig> = {};
        snapshot.forEach((doc) => {
          const data = doc.data();
          schools[doc.id] = {
            name: data.name,
            baseUrl: data.baseUrl,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
          };
        });
        callback(schools);
      },
      (error) => {
        console.error("Error subscribing to schools:", error);
        if (error.code === "resource-exhausted") {
          // Implement exponential backoff for resubscription
          setTimeout(() => {
            console.log("Attempting to resubscribe after error");
            this.subscribeToSchools(callback);
          }, 5000);
        }
      }
    );

    activeSubscription = unsubscribe;
    return () => {
      console.log("Unsubscribing from schools");
      unsubscribe();
      activeSubscription = null;
    };
  }
}
