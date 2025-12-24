export interface User {
  uid: string
  email: string
  displayName: string | null
  role: 'admin' | 'subcontractor'
  createdAt: Date
}

export interface SubcontractorProfile {
  uid: string
  companyName: string
  contactName: string
  email: string
  phone: string
  ein: string
  address: string
  insuranceCertificate?: string
  w9Document?: string
  bankInfo?: BankInfo
  status: 'pending' | 'verified' | 'suspended'
  createdAt: Date
  updatedAt: Date
}

export interface BankInfo {
  accountHolderName: string
  routingNumber: string
  accountNumber: string
  accountType: 'checking' | 'savings'
  verified: boolean
}

export interface Contract {
  id: string
  contractNumber: string
  clientName: string
  totalAmount: number
  subcontractorAmount: number
  margin: number
  taxReserve: number
  profit: number
  status: 'pending' | 'active' | 'completed' | 'cancelled'
  startDate: Date
  endDate: Date
  paymentSchedule: PaymentSchedule[]
  subcontractorId: string
  governmentContract: boolean
  facility: string
  scopeOfWork: string
  createdAt: Date
  updatedAt: Date
}

export interface PaymentSchedule {
  id: string
  contractId: string
  amount: number
  scheduledDate: Date
  status: 'scheduled' | 'processing' | 'completed' | 'failed'
  paidDate?: Date
  billComTransactionId?: string
  notes?: string
}

export interface Message {
  id: string
  contractId: string
  senderId: string
  senderName: string
  senderRole: 'admin' | 'subcontractor'
  content: string
  type: 'text' | 'update' | 'payment' | 'document'
  read: boolean
  createdAt: Date
}

export interface Notification {
  id: string
  userId: string
  type: 'payment' | 'message' | 'contract' | 'document'
  title: string
  message: string
  read: boolean
  link?: string
  createdAt: Date
}

export interface BillComPayment {
  vendorId: string
  amount: number
  scheduledDate: string
  description: string
  contractId: string
}
