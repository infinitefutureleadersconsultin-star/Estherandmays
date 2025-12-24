import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  Auth,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase'
import { User } from '@/types'

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'estherandmays@gmail.com'

/**
 * Get initialized Auth instance
 * Throws error if Firebase Auth is not initialized (should never happen at runtime)
 */
function getAuthInstance(): Auth {
  if (!auth) {
    throw new Error('Firebase Auth not initialized. This should not happen at runtime.')
  }
  return auth
}

export const isAdmin = (email: string): boolean => {
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
}

export const registerUser = async (
  email: string,
  password: string,
  displayName: string
): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(getAuthInstance(), email, password)
  const role = isAdmin(email) ? 'admin' : 'subcontractor'

  const userData: User = {
    uid: userCredential.user.uid,
    email: email,
    displayName: displayName,
    role: role,
    createdAt: new Date(),
  }

  await setDoc(doc(db!, 'users', userCredential.user.uid), userData)

  return userData
}

export const loginUser = async (email: string, password: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(getAuthInstance(), email, password)
  const userDoc = await getDoc(doc(db!, 'users', userCredential.user.uid))

  if (!userDoc.exists()) {
    throw new Error('User data not found')
  }

  return userDoc.data() as User
}

export const logoutUser = async (): Promise<void> => {
  await signOut(getAuthInstance())
}

export const getCurrentUser = (): Promise<FirebaseUser | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(getAuthInstance(), (user) => {
      unsubscribe()
      resolve(user)
    })
  })
}

export const getUserData = async (uid: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(db!, 'users', uid))
  if (!userDoc.exists()) return null
  return userDoc.data() as User
}
