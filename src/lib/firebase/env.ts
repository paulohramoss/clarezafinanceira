export function getFirebaseConfig() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "dashboard-c23c8"

  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ??
      `${projectId}.firebaseapp.com`,
    projectId,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ??
      "115815405530",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  }
}

export function isFirebaseConfigured() {
  const config = getFirebaseConfig()
  return Boolean(config.apiKey && config.authDomain && config.projectId && config.appId)
}
