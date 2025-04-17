import * as admin from "firebase-admin";
import {AppConfig} from "../config/app.config";

/**
 * Clase para gestionar la conexión y operaciones con Firestore
 */
export class FirestoreConfig {
  private static instance: FirestoreConfig;
  private db: FirebaseFirestore.Firestore | null = null;
  private initialized = false;

  /**
   * Constructor privado para implementar el patrón Singleton
   * @private
   */
  private constructor() {
    // Constructor privado para implementar Singleton
  }

  /**
   * Obtiene la instancia única de FirestoreConfig (Singleton)
   * @return {FirestoreConfig} La instancia única de FirestoreConfig
   */
  public static getInstance(): FirestoreConfig {
    if (!FirestoreConfig.instance) {
      FirestoreConfig.instance = new FirestoreConfig();
    }
    return FirestoreConfig.instance;
  }

  /**
   * Inicializa la conexión a Firestore
   */
  public initialize(): void {
    if (this.initialized) {
      return;
    }

    if (admin.apps.length === 0) {
      admin.initializeApp();
    }

    this.db = admin.firestore();


    if (
      process.env.NODE_ENV !== "production" &&
        process.env.FUNCTIONS_EMULATOR !== "true") {
      try {
        this.db.settings({
          timestampsInSnapshots: true,
        });
      } catch (error) {
        console.warn("Error al configurar Firestore settings:", error);
        // Continuar de todos modos
      }
    }

    this.initialized = true;
    console.log("Firestore inicializado correctamente");
  }

  /**
   * Obtiene la instancia de Firestore
   * @return {FirebaseFirestore.Firestore} La instancia de Firestore
   */
  public getDb(): FirebaseFirestore.Firestore {
    if (!this.initialized) {
      this.initialize();
    }

    if (!this.db) {
      throw new Error("Firestore no está inicializado correctamente");
    }

    return this.db;
  }
}

export const firestoreDb = FirestoreConfig.getInstance();

export const usersCollection = () =>
  firestoreDb.getDb().collection(AppConfig.firestore.collections.users);
export const tasksCollection = () =>
  firestoreDb.getDb().collection(AppConfig.firestore.collections.tasks);
