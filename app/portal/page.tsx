'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Building2,
  DollarSign,
  FileText,
  MessageSquare,
  Bell,
  CheckCircle,
  Clock,
  Download,
  Upload,
  User,
  LogOut,
  Calendar,
  TrendingUp,
  Send,
  AlertCircle,
} from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { logoutUser } from '@/lib/auth'
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface Contract {
  id: string
  name: string
  description: string
  totalAmount: number
  paidToDate?: number
  status: string
  vendorId?: string
  createdAt: any
}

interface Payment {
  id: string
  amount: number
  scheduledDate: any
  invoiceSubmittedDate?: any
  expectedPaymentDate?: any
  paymentTerms?: 'Net 15' | 'Net 30' | 'Net 60'
  status: 'completed' | 'scheduled' | 'overdue' | 'pending_government'
  description: string
  projectName?: string
}

interface Message {
  id: string
  subject: string
  message: string
  createdAt: any
  senderId: string
  senderName?: string
  read?: boolean
}

export default function SubcontractorPortal() {
  const router = useRouter()
  const { user, setUser } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [contracts, setContracts] = useState<Contract[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [activeContract, setActiveContract] = useState<Contract | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
    } else if (user.role !== 'subcontractor') {
      router.push('/admin')
    } else {
      loadPortalData()
    }
  }, [user, router])

  const loadPortalData = async () => {
    if (!user || !db) {
      setLoading(false)
      return
    }

    try {
      // Load contracts assigned to this vendor
      const contractsQuery = query(
        collection(db, 'contracts'),
        where('vendorId', '==', user.uid),
        orderBy('createdAt', 'desc')
      )
      const contractsSnapshot = await getDocs(contractsQuery)
      const contractsList = contractsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Contract[]

      setContracts(contractsList)

      // Set the first active contract as primary
      const active = contractsList.find(c => c.status === 'active') || contractsList[0]
      setActiveContract(active || null)

      // Load payments for this vendor
      const paymentsQuery = query(
        collection(db, 'payments'),
        where('vendorId', '==', user.uid),
        orderBy('scheduledDate', 'asc')
      )
      const paymentsSnapshot = await getDocs(paymentsQuery)
      const paymentsList = paymentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Payment[]

      setPayments(paymentsList)

      // Load messages for this vendor
      const messagesQuery = query(
        collection(db, 'messages'),
        where('recipientId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(10)
      )
      const messagesSnapshot = await getDocs(messagesQuery)
      const messagesList = messagesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[]

      setMessages(messagesList)
    } catch (error) {
      console.error('Failed to load portal data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logoutUser()
    setUser(null)
    router.push('/')
  }

  const formatDate = (date: any) => {
    if (!date) return 'N/A'
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const calculateProgress = () => {
    if (!activeContract) return 0
    const paid = activeContract.paidToDate || 0
    const total = activeContract.totalAmount || 1
    return (paid / total) * 100
  }

  const getNextPayment = () => {
    return payments.find(p => p.status === 'scheduled' || p.status === 'pending_government')
  }

  const unreadCount = messages.filter(m => !m.read).length

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Empty state if no contracts
  if (!activeContract) {
    return (
      <div className="min-h-screen bg-slate-50">
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-slate-900">Vendor Portal</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">{user?.displayName}</p>
                    <p className="text-xs text-slate-500">Fulfillment Partner</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-600 hover:text-red-600 transition"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <FileText className="h-24 w-24 text-slate-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-slate-900 mb-4">No Projects Assigned Yet</h1>
            <p className="text-slate-600 mb-8">
              You don't have any active projects at the moment. Our team will notify you when new opportunities are available.
            </p>
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 max-w-md mx-auto">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Need Help?</h3>
              <p className="text-slate-600 mb-4 text-sm">
                Contact us if you have any questions or concerns
              </p>
              <div className="space-y-2 text-sm text-slate-700">
                <p>
                  <strong>Email:</strong><br />
                  <a href="mailto:estherandmays@gmail.com" className="text-blue-600 hover:underline">
                    estherandmays@gmail.com
                  </a>
                </p>
                <p>
                  <strong>Organization:</strong><br />
                  The Esther & Mays Group
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const progressPercentage = calculateProgress()
  const nextPayment = getNextPayment()
  const remainingBalance = activeContract.totalAmount - (activeContract.paidToDate || 0)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-slate-900">Vendor Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-slate-600 hover:text-blue-600 transition">
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{user?.displayName}</p>
                  <p className="text-xs text-slate-500">Fulfillment Partner</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-600 hover:text-red-600 transition"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {user?.displayName}!
          </h1>
          <p className="text-slate-600">Track your projects and payments all in one place.</p>
        </motion.div>

        {/* Contract Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-xl p-8 mb-8 text-white"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-blue-100 mb-1">Active Project</p>
              <h2 className="text-2xl font-bold mb-1">{activeContract.name}</h2>
              <p className="text-blue-100">{activeContract.description || 'Government Procurement Project'}</p>
            </div>
            <span className="px-4 py-2 bg-green-500 rounded-full text-sm font-semibold uppercase">
              {activeContract.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <p className="text-blue-100 text-sm mb-1">Total Project Value</p>
              <p className="text-3xl font-bold">{formatCurrency(activeContract.totalAmount)}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Paid to Date</p>
              <p className="text-3xl font-bold">{formatCurrency(activeContract.paidToDate || 0)}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Remaining Balance</p>
              <p className="text-3xl font-bold">{formatCurrency(remainingBalance)}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-blue-100">Payment Progress</span>
              <span className="font-semibold">{progressPercentage.toFixed(0)}% Complete</span>
            </div>
            <div className="w-full bg-blue-800/30 rounded-full h-3">
              <div
                className="bg-white h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Next Payment */}
            {nextPayment && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg border border-slate-200 p-6"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-4">Next Payment</h3>
                <div className="p-6 bg-green-50 border-2 border-green-200 rounded-xl">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-sm text-slate-600 mb-1">Scheduled for</p>
                      <p className="text-2xl font-bold text-slate-900 mb-1">
                        {formatDate(nextPayment.scheduledDate)}
                      </p>
                      <p className="text-3xl font-bold text-green-600 mb-3">
                        {formatCurrency(nextPayment.amount)}
                      </p>
                      {nextPayment.paymentTerms && (
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                          {nextPayment.paymentTerms} Terms
                        </span>
                      )}
                    </div>
                    <div className="bg-green-500 p-4 rounded-full">
                      <DollarSign className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  {/* Net 30 Invoice Tracking */}
                  {nextPayment.invoiceSubmittedDate && nextPayment.expectedPaymentDate && (
                    <div className="mt-4 pt-4 border-t border-green-200 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Invoice Submitted to Government:</span>
                        <span className="font-semibold text-slate-900">
                          {formatDate(nextPayment.invoiceSubmittedDate)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Expected Payment Date:</span>
                        <span className="font-semibold text-green-700">
                          {formatDate(nextPayment.expectedPaymentDate)}
                        </span>
                      </div>
                      <div className="flex items-center mt-2 text-xs text-slate-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {nextPayment.status === 'pending_government' && (
                          <span>Awaiting government payment processing ({nextPayment.paymentTerms || 'Net 30'})</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <p className="mt-4 text-sm text-slate-600">
                  Funds will be deposited via ACH to your registered bank account
                </p>
              </motion.div>
            )}

            {/* Payment History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg border border-slate-200 p-6"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-4">Payment Schedule</h3>
              {payments.length === 0 ? (
                <div className="text-center py-8">
                  <DollarSign className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600">No payments scheduled yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {payments.map((payment, index) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div
                          className={`p-2 rounded-lg ${
                            payment.status === 'completed'
                              ? 'bg-green-100'
                              : payment.status === 'overdue'
                              ? 'bg-red-100'
                              : 'bg-blue-100'
                          }`}
                        >
                          {payment.status === 'completed' ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : payment.status === 'overdue' ? (
                            <AlertCircle className="h-5 w-5 text-red-600" />
                          ) : (
                            <Clock className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{payment.description || `Payment ${index + 1}`}</p>
                          <p className="text-sm text-slate-500">{formatDate(payment.scheduledDate)}</p>
                          {payment.paymentTerms && (
                            <p className="text-xs text-slate-400 mt-1">{payment.paymentTerms}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">{formatCurrency(payment.amount)}</p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            payment.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : payment.status === 'overdue'
                              ? 'bg-red-100 text-red-700'
                              : payment.status === 'pending_government'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {payment.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Documents */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg border border-slate-200 p-6"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-4">Documents</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => alert('Document download feature - Connect to Firebase Storage')}
                  className="flex items-center p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group"
                >
                  <Download className="h-5 w-5 text-slate-600 group-hover:text-blue-600 mr-3" />
                  <span className="font-semibold text-slate-700 group-hover:text-blue-600">
                    Download W-9
                  </span>
                </button>
                <button
                  onClick={() => alert('Document download feature - Connect to Firebase Storage')}
                  className="flex items-center p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group"
                >
                  <Download className="h-5 w-5 text-slate-600 group-hover:text-blue-600 mr-3" />
                  <span className="font-semibold text-slate-700 group-hover:text-blue-600">
                    Insurance Cert
                  </span>
                </button>
                <button
                  onClick={() => alert('Document download feature - Connect to Firebase Storage')}
                  className="flex items-center p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group"
                >
                  <Download className="h-5 w-5 text-slate-600 group-hover:text-blue-600 mr-3" />
                  <span className="font-semibold text-slate-700 group-hover:text-blue-600">
                    Agreement Copy
                  </span>
                </button>
                <button
                  onClick={() => alert('Document upload feature - Connect to Firebase Storage')}
                  className="flex items-center p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group"
                >
                  <Upload className="h-5 w-5 text-slate-600 group-hover:text-blue-600 mr-3" />
                  <span className="font-semibold text-slate-700 group-hover:text-blue-600">
                    Upload Doc
                  </span>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Messages */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg border border-slate-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Messages</h3>
                <MessageSquare className="h-5 w-5 text-slate-600" />
              </div>

              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600 text-sm">No messages yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.slice(0, 3).map((msg, index) => (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-lg border cursor-pointer transition ${
                        !msg.read
                          ? 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-semibold text-slate-900">{msg.senderName || 'Admin'}</p>
                        {!msg.read && (
                          <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{msg.subject || msg.message}</p>
                      <p className="text-xs text-slate-500">{formatDate(msg.createdAt)}</p>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => alert('Messaging feature - Build chat interface')}
                className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center"
              >
                <Send className="h-4 w-4 mr-2" />
                Open Chat
              </button>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-900 rounded-xl shadow-lg p-6 text-white"
            >
              <h3 className="text-lg font-bold mb-4">Need Help?</h3>
              <p className="text-slate-300 mb-4 text-sm">
                Contact us if you have any questions or concerns
              </p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-400 text-xs mb-1">Email</p>
                  <a
                    href="mailto:estherandmays@gmail.com"
                    className="text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    estherandmays@gmail.com
                  </a>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">Organization</p>
                  <p className="font-semibold">The Esther & Mays Group</p>
                  <p className="text-slate-400 text-xs mt-1">Charlotte, North Carolina</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
