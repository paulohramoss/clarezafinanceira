"use client"

import { getApp, getApps, initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getFirebaseConfig, isFirebaseConfigured } from "@/lib/firebase/env"

export function createFirebaseClient() {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase não configurado. Preencha as variáveis NEXT_PUBLIC_FIREBASE_*.")
  }

  const app = getApps().length ? getApp() : initializeApp(getFirebaseConfig())

  return {
    app,
    auth: getAuth(app),
    db: getFirestore(app),
  }
}

export function createOptionalFirebaseClient() {
  try {
    return createFirebaseClient()
  } catch {
    return null
  }
}
