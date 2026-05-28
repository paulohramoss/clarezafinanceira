"use client"

import { deleteUser, onAuthStateChanged, type User } from "firebase/auth"
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  writeBatch,
  type Firestore,
} from "firebase/firestore"
import { getDefaultCategories } from "@/lib/finance/constants"
import { createOptionalFirebaseClient } from "@/lib/firebase/client"
import type {
  Account,
  Bill,
  Category,
  Debt,
  FinancialInstitution,
  FinanceData,
  Goal,
  Profile,
  Transaction,
} from "@/types/finance"

export type FirebaseFinanceCollection =
  | "institutions"
  | "accounts"
  | "categories"
  | "transactions"
  | "bills"
  | "debts"
  | "goals"

type FinanceCollectionItem =
  | FinancialInstitution
  | Account
  | Category
  | Transaction
  | Bill
  | Debt
  | Goal

const FINANCE_COLLECTIONS: FirebaseFinanceCollection[] = [
  "institutions",
  "accounts",
  "categories",
  "transactions",
  "bills",
  "debts",
  "goals",
]

function defaultProfile(user: User): Profile {
  return {
    id: user.uid,
    full_name: user.displayName ?? user.email?.split("@")[0] ?? null,
    visual_mode: "simple",
    font_scale: "normal",
    help_style: "direct",
    main_goal: null,
    approximate_income: null,
    currency: "BRL",
  }
}

function collectionRef(db: Firestore, userId: string, table: FirebaseFinanceCollection) {
  return collection(db, "users", userId, table)
}

function orderedCollection(db: Firestore, userId: string, table: FirebaseFinanceCollection) {
  const ref = collectionRef(db, userId, table)

  if (table === "transactions") return query(ref, orderBy("date", "desc"))
  if (table === "bills") return query(ref, orderBy("due_date", "asc"))
  if (table === "categories") return query(ref, orderBy("name", "asc"))
  if (table === "institutions") return query(ref, orderBy("name", "asc"))

  return query(ref, orderBy("created_at", "asc"))
}

async function getAuthUser() {
  const firebase = createOptionalFirebaseClient()
  if (!firebase) return null
  if (firebase.auth.currentUser) return firebase.auth.currentUser

  return new Promise<User | null>((resolve) => {
    const unsubscribe = onAuthStateChanged(firebase.auth, (user) => {
      unsubscribe()
      resolve(user)
    })
  })
}

async function loadCollection<T extends FinanceCollectionItem>(
  db: Firestore,
  userId: string,
  table: FirebaseFinanceCollection,
) {
  const snapshot = await getDocs(orderedCollection(db, userId, table))
  return snapshot.docs.map((item) => item.data() as T)
}

export async function fetchFirebaseFinanceData(): Promise<FinanceData | null> {
  const firebase = createOptionalFirebaseClient()
  if (!firebase) return null

  const user = await getAuthUser()
  if (!user) return null

  const profileRef = doc(firebase.db, "users", user.uid)
  const [profileSnapshot, institutions, accounts, categories, transactions, bills, debts, goals] =
    await Promise.all([
      getDoc(profileRef),
      loadCollection<FinancialInstitution>(firebase.db, user.uid, "institutions"),
      loadCollection<Account>(firebase.db, user.uid, "accounts"),
      loadCollection<Category>(firebase.db, user.uid, "categories"),
      loadCollection<Transaction>(firebase.db, user.uid, "transactions"),
      loadCollection<Bill>(firebase.db, user.uid, "bills"),
      loadCollection<Debt>(firebase.db, user.uid, "debts"),
      loadCollection<Goal>(firebase.db, user.uid, "goals"),
    ])

  const profile = profileSnapshot.exists()
    ? (profileSnapshot.data() as Profile)
    : defaultProfile(user)

  if (!profileSnapshot.exists()) {
    await setDoc(profileRef, profile, { merge: true })
  }

  return {
    profile,
    institutions,
    accounts,
    categories: [...getDefaultCategories(user.uid), ...categories],
    transactions,
    bills,
    debts,
    goals,
  }
}

export async function ensureFirebaseProfile(user: User, fullName?: string) {
  const firebase = createOptionalFirebaseClient()
  if (!firebase) return

  const profile: Profile = {
    ...defaultProfile(user),
    full_name: fullName || user.displayName || user.email?.split("@")[0] || null,
    created_at: new Date().toISOString(),
  }

  await setDoc(doc(firebase.db, "users", user.uid), profile, { merge: true })
}

export async function saveFirebaseProfile(profile: Profile) {
  const firebase = createOptionalFirebaseClient()
  const user = await getAuthUser()
  if (!firebase || !user) return

  await setDoc(doc(firebase.db, "users", user.uid), { ...profile, id: user.uid }, { merge: true })
}

export async function upsertFirebaseItem<T extends FinanceCollectionItem>(
  table: FirebaseFinanceCollection,
  item: T,
) {
  const firebase = createOptionalFirebaseClient()
  const user = await getAuthUser()
  if (!firebase || !user) return

  await setDoc(doc(firebase.db, "users", user.uid, table, item.id), item, { merge: true })
}

export async function upsertFirebaseItems<T extends FinanceCollectionItem>(
  table: FirebaseFinanceCollection,
  items: T[],
) {
  const firebase = createOptionalFirebaseClient()
  const user = await getAuthUser()
  if (!firebase || !user || items.length === 0) return

  for (let index = 0; index < items.length; index += 450) {
    const batch = writeBatch(firebase.db)
    items.slice(index, index + 450).forEach((item) => {
      batch.set(doc(firebase.db, "users", user.uid, table, item.id), item, { merge: true })
    })
    await batch.commit()
  }
}

export async function deleteFirebaseItem(table: FirebaseFinanceCollection, id: string) {
  const firebase = createOptionalFirebaseClient()
  const user = await getAuthUser()
  if (!firebase || !user) return

  await deleteDoc(doc(firebase.db, "users", user.uid, table, id))
}

export async function clearFirebaseFinancialData() {
  const firebase = createOptionalFirebaseClient()
  const user = await getAuthUser()
  if (!firebase || !user) return

  for (const table of FINANCE_COLLECTIONS) {
    const snapshot = await getDocs(collectionRef(firebase.db, user.uid, table))
    for (let index = 0; index < snapshot.docs.length; index += 450) {
      const batch = writeBatch(firebase.db)
      snapshot.docs.slice(index, index + 450).forEach((item) => batch.delete(item.ref))
      await batch.commit()
    }
  }
}

export async function deleteFirebaseAccountDataAndUser() {
  const firebase = createOptionalFirebaseClient()
  const user = await getAuthUser()
  if (!firebase || !user) return false

  await clearFirebaseFinancialData()
  await deleteDoc(doc(firebase.db, "users", user.uid))
  await deleteUser(user)

  return true
}
