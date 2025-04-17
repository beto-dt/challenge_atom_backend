import * as admin from "firebase-admin";
import {AppConfig} from "@infrastructure/config/app.config";

/**
 * Clase para la configuración y gestión de Firebase
 */
export class FirebaseConfig {
  private static instance: FirebaseConfig;
  private initialized = false;

  /**
   * Constructor privado para implementar el patrón Singleton
   */
  private constructor() {
    // Private constructor to prevent direct instantiation
  }

  /**
     * Obtiene la instancia única de FirebaseConfig (Singleton)
     * @return {FirebaseConfig} La instancia única de FirebaseConfig
     */
  public static getInstance(): FirebaseConfig {
    if (!FirebaseConfig.instance) {
      FirebaseConfig.instance = new FirebaseConfig();
    }
    return FirebaseConfig.instance;
  }

  /**
     * Inicializa la aplicación Firebase Admin si no está ya inicializada
     */
  public initialize(): void {
    if (this.initialized) {
      return;
    }
    if (admin.apps.length === 0) {
      try {
        admin.initializeApp({
          databaseURL: AppConfig.firebase.databaseURL,
          storageBucket: AppConfig.firebase.storageBucket,
          projectId: AppConfig.firebase.projectId,
        });
        const db = admin.firestore();
        db.settings({
          timestampsInSnapshots: true,
        });
        this.initialized = true;
        console.log("Firebase Admin inicializado correctamente");
      } catch (error) {
        console.error("Error al inicializar Firebase Admin:", error);
        throw error;
      }
    } else {
      this.initialized = true;
      console.log("Firebase Admin ya estaba inicializado");
    }
  }
}

export const firebaseConfig = FirebaseConfig.getInstance();
firebaseConfig.initialize();
