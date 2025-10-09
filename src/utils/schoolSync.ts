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
export class SchoolSyncService {
  /**
   * Save a school to the cloud
   */
  static async saveSchool(
    key: string,
    config: SchoolConfig
  ): Promise<void> {
    try {
      const schoolRef = doc(db, SCHOOLS_COLLECTION, key);
      await setDoc(schoolRef, {
        ...config,
        updatedAt: Timestamp.now(),
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error saving school to cloud:", error);
      throw new Error("Failed to save school to cloud");
    }
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
    try {
      const promises = Object.entries(localSchools).map(([key, config]) =>
        this.saveSchool(key, config)
      );
      await Promise.all(promises);
    } catch (error) {
      console.error("Error syncing to cloud:", error);
      throw new Error("Failed to sync to cloud");
    }
  }

  /**
   * Subscribe to real-time updates
   */
  static subscribeToSchools(
    callback: (schools: Record<string, SchoolConfig>) => void
  ): () => void {
    const schoolsRef = collection(db, SCHOOLS_COLLECTION);

    const unsubscribe = onSnapshot(
      schoolsRef,
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
      }
    );

    return unsubscribe;
  }
}
