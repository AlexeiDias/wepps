import { initializeApp, getApps } from 'firebase/app'
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
const db = getFirestore(app)
const storage = getStorage(app)

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Project {
  id?: string
  name: string
  description: string
  liveUrl: string
  screenshotUrl: string
  screenshotPath: string   // storage path for deletion
  status: 'live' | 'draft'
  order: number
  createdAt?: Timestamp
}

export interface Inquiry {
  id?: string
  name: string
  email: string
  message: string
  createdAt?: Timestamp
  read: boolean
}

// ─── Projects CRUD ────────────────────────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  const q = query(collection(db, 'projects'), orderBy('order', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Project))
}

export async function addProject(project: Omit<Project, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'projects'), {
    ...project,
    createdAt: Timestamp.now(),
  })
  return docRef.id
}

export async function updateProject(id: string, data: Partial<Project>): Promise<void> {
  await updateDoc(doc(db, 'projects', id), data)
}

export async function deleteProject(id: string, screenshotPath: string): Promise<void> {
  await deleteDoc(doc(db, 'projects', id))
  if (screenshotPath) {
    try {
      await deleteObject(ref(storage, screenshotPath))
    } catch {
      // screenshot may already be gone
    }
  }
}

// ─── Screenshot upload ────────────────────────────────────────────────────────

export async function uploadScreenshot(file: File): Promise<{ url: string; path: string }> {
  const path = `screenshots/${Date.now()}_${file.name}`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  const url = await getDownloadURL(storageRef)
  return { url, path }
}

// ─── Inquiries ────────────────────────────────────────────────────────────────

export async function getInquiries(): Promise<Inquiry[]> {
  const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Inquiry))
}

export async function markInquiryRead(id: string): Promise<void> {
  await updateDoc(doc(db, 'inquiries', id), { read: true })
}
