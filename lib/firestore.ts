import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  addDoc,
  serverTimestamp,
  orderBy,
  limit,
  Firestore,
} from 'firebase/firestore'
import { db } from './firebase'
import {
  SubcontractorProfile,
  Contract,
  PaymentSchedule,
  Message,
  Notification,
} from '@/types'

/**
 * Get initialized Firestore instance
 * Throws error if Firestore is not initialized (should never happen at runtime)
 */
function getDbInstance(): Firestore {
  if (!db) {
    throw new Error('Firestore not initialized. This should not happen at runtime.')
  }
  return db
}

// Subcontractor Operations
export async function createSubcontractorProfile(
  uid: string,
  profile: Omit<SubcontractorProfile, 'uid' | 'createdAt' | 'updatedAt'>
) {
  const profileData = {
    ...profile,
    uid,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  await setDoc(doc(getDbInstance(), 'subcontractors', uid), profileData)
  return profileData
}

export async function getSubcontractorProfile(uid: string): Promise<SubcontractorProfile | null> {
  const profileDoc = await getDoc(doc(getDbInstance(), 'subcontractors', uid))
  if (!profileDoc.exists()) return null
  return profileDoc.data() as SubcontractorProfile
}

export async function updateSubcontractorProfile(
  uid: string,
  updates: Partial<SubcontractorProfile>
) {
  await updateDoc(doc(getDbInstance(), 'subcontractors', uid), {
    ...updates,
    updatedAt: new Date(),
  })
}

export async function getAllSubcontractors(): Promise<SubcontractorProfile[]> {
  const querySnapshot = await getDocs(collection(getDbInstance(), 'subcontractors'))
  return querySnapshot.docs.map((doc) => doc.data() as SubcontractorProfile)
}

// Contract Operations
export async function createContract(
  contractData: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Contract> {
  const contract = {
    ...contractData,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const docRef = await addDoc(collection(db!, 'contracts'), contract)
  const newContract = { ...contract, id: docRef.id }

  await updateDoc(doc(getDbInstance(), 'contracts', docRef.id), { id: docRef.id })

  return newContract as Contract
}

export async function getContract(contractId: string): Promise<Contract | null> {
  const contractDoc = await getDoc(doc(getDbInstance(), 'contracts', contractId))
  if (!contractDoc.exists()) return null
  return contractDoc.data() as Contract
}

export async function getContractsBySubcontractor(subcontractorId: string): Promise<Contract[]> {
  const q = query(
    collection(getDbInstance(), 'contracts'),
    where('subcontractorId', '==', subcontractorId)
  )
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => doc.data() as Contract)
}

export async function getAllContracts(): Promise<Contract[]> {
  const querySnapshot = await getDocs(collection(getDbInstance(), 'contracts'))
  return querySnapshot.docs.map((doc) => doc.data() as Contract)
}

export async function updateContract(contractId: string, updates: Partial<Contract>) {
  await updateDoc(doc(getDbInstance(), 'contracts', contractId), {
    ...updates,
    updatedAt: new Date(),
  })
}

// Payment Schedule Operations
export async function createPaymentSchedule(
  payment: Omit<PaymentSchedule, 'id'>
): Promise<PaymentSchedule> {
  const docRef = await addDoc(collection(db!, 'payments'), payment)
  const newPayment = { ...payment, id: docRef.id }
  await updateDoc(doc(getDbInstance(), 'payments', docRef.id), { id: docRef.id })
  return newPayment as PaymentSchedule
}

export async function getPaymentsByContract(contractId: string): Promise<PaymentSchedule[]> {
  const q = query(
    collection(getDbInstance(), 'payments'),
    where('contractId', '==', contractId),
    orderBy('scheduledDate', 'asc')
  )
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => doc.data() as PaymentSchedule)
}

export async function updatePaymentStatus(
  paymentId: string,
  status: PaymentSchedule['status'],
  billComTransactionId?: string
) {
  const updates: any = { status }
  if (status === 'completed') {
    updates.paidDate = new Date()
  }
  if (billComTransactionId) {
    updates.billComTransactionId = billComTransactionId
  }

  await updateDoc(doc(getDbInstance(), 'payments', paymentId), updates)
}

// Message Operations
export async function sendMessage(
  message: Omit<Message, 'id' | 'createdAt'>
): Promise<Message> {
  const messageData = {
    ...message,
    createdAt: new Date(),
  }

  const docRef = await addDoc(collection(db!, 'messages'), messageData)
  const newMessage = { ...messageData, id: docRef.id }
  await updateDoc(doc(getDbInstance(), 'messages', docRef.id), { id: docRef.id })

  return newMessage as Message
}

export async function getMessagesByContract(contractId: string): Promise<Message[]> {
  const q = query(
    collection(getDbInstance(), 'messages'),
    where('contractId', '==', contractId),
    orderBy('createdAt', 'desc'),
    limit(50)
  )
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => doc.data() as Message)
}

export async function markMessageAsRead(messageId: string) {
  await updateDoc(doc(getDbInstance(), 'messages', messageId), { read: true })
}

// Notification Operations
export async function createNotification(
  notification: Omit<Notification, 'id' | 'createdAt'>
): Promise<Notification> {
  const notificationData = {
    ...notification,
    createdAt: new Date(),
  }

  const docRef = await addDoc(collection(db!, 'notifications'), notificationData)
  const newNotification = { ...notificationData, id: docRef.id }
  await updateDoc(doc(getDbInstance(), 'notifications', docRef.id), { id: docRef.id })

  return newNotification as Notification
}

export async function getNotificationsByUser(userId: string): Promise<Notification[]> {
  const q = query(
    collection(getDbInstance(), 'notifications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(20)
  )
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => doc.data() as Notification)
}

export async function markNotificationAsRead(notificationId: string) {
  await updateDoc(doc(getDbInstance(), 'notifications', notificationId), { read: true })
}
