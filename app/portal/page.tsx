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
} from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { logoutUser } from '@/lib/auth'

export default function SubcontractorPortal() {
  const router = useRouter()
  const { user, setUser } = useAuthStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
    } else if (user.role !== 'subcontractor') {
      router.push('/admin')
    } else {
      setLoading(false)
    }
  }, [user, router])

  const handleLogout = async () => {
    await logoutUser()
    setUser(null)
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const contractInfo = {
    contractNumber: 'NC-ENV-001',
    projectName: 'VA Medical Center - Environmental Services',
    totalAmount: 100000,
    paidToDate: 25000,
    remaining: 75000,
    nextPayment: {
      amount: 25000,
      date: 'December 3, 2025',
    },
    status: 'active',
  }

  const paymentHistory = [
    {
      date: 'Nov 3, 2025',
      amount: '$25,000',
      status: 'completed',
      description: 'Month 1 Payment',
    },
    {
      date: 'Dec 3, 2025',
      amount: '$25,000',
      status: 'scheduled',
      description: 'Month 2 Payment',
    },
    {
      date: 'Jan 3, 2026',
      amount: '$25,000',
      status: 'scheduled',
      description: 'Month 3 Payment',
    },
    {
      date: 'Feb 3, 2026',
      amount: '$25,000',
      status: 'scheduled',
      description: 'Month 4 Payment - Final',
    },
  ]

  const recentMessages = [
    {
      from: 'Admin',
      message: 'Payment scheduled for Dec 3rd',
      time: '2 hours ago',
      unread: true,
    },
    {
      from: 'Admin',
      message: 'Please review updated scope of work',
      time: '1 day ago',
      unread: false,
    },
    {
      from: 'Admin',
      message: 'Insurance certificate approved',
      time: '3 days ago',
      unread: false,
    },
  ]

  const progressPercentage = (contractInfo.paidToDate / contractInfo.totalAmount) * 100

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-slate-900">Subcontractor Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-slate-600 hover:text-blue-600 transition">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  1
                </span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{user?.displayName}</p>
                  <p className="text-xs text-slate-500">Subcontractor</p>
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
          <p className="text-slate-600">Track your contracts and payments all in one place.</p>
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
              <p className="text-blue-100 mb-1">Active Contract</p>
              <h2 className="text-2xl font-bold mb-1">{contractInfo.projectName}</h2>
              <p className="text-blue-100">Contract #{contractInfo.contractNumber}</p>
            </div>
            <span className="px-4 py-2 bg-green-500 rounded-full text-sm font-semibold">
              {contractInfo.status.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <p className="text-blue-100 text-sm mb-1">Total Contract Value</p>
              <p className="text-3xl font-bold">${contractInfo.totalAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Paid to Date</p>
              <p className="text-3xl font-bold">${contractInfo.paidToDate.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Remaining Balance</p>
              <p className="text-3xl font-bold">${contractInfo.remaining.toLocaleString()}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-blue-100">Payment Progress</span>
              <span className="font-semibold">{progressPercentage}% Complete</span>
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg border border-slate-200 p-6"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-4">Next Payment</h3>
              <div className="flex items-center justify-between p-6 bg-green-50 border-2 border-green-200 rounded-xl">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Scheduled for</p>
                  <p className="text-2xl font-bold text-slate-900 mb-1">
                    {contractInfo.nextPayment.date}
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    ${contractInfo.nextPayment.amount.toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-500 p-4 rounded-full">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-600">
                Funds will be deposited via ACH to your registered bank account
              </p>
            </motion.div>

            {/* Payment History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg border border-slate-200 p-6"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-4">Payment Schedule</h3>
              <div className="space-y-3">
                {paymentHistory.map((payment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-2 rounded-lg ${
                          payment.status === 'completed'
                            ? 'bg-green-100'
                            : 'bg-blue-100'
                        }`}
                      >
                        {payment.status === 'completed' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{payment.description}</p>
                        <p className="text-sm text-slate-500">{payment.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{payment.amount}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          payment.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
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
                <button className="flex items-center p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group">
                  <Download className="h-5 w-5 text-slate-600 group-hover:text-blue-600 mr-3" />
                  <span className="font-semibold text-slate-700 group-hover:text-blue-600">
                    Download W-9
                  </span>
                </button>
                <button className="flex items-center p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group">
                  <Download className="h-5 w-5 text-slate-600 group-hover:text-blue-600 mr-3" />
                  <span className="font-semibold text-slate-700 group-hover:text-blue-600">
                    Insurance Cert
                  </span>
                </button>
                <button className="flex items-center p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group">
                  <Download className="h-5 w-5 text-slate-600 group-hover:text-blue-600 mr-3" />
                  <span className="font-semibold text-slate-700 group-hover:text-blue-600">
                    Contract Copy
                  </span>
                </button>
                <button className="flex items-center p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group">
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

              <div className="space-y-4">
                {recentMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border cursor-pointer transition ${
                      msg.unread
                        ? 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold text-slate-900">{msg.from}</p>
                      {msg.unread && (
                        <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{msg.message}</p>
                    <p className="text-xs text-slate-500">{msg.time}</p>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
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
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Email:</strong><br />
                  issiahmclean1999@gmail.com
                </p>
                <p>
                  <strong>Admin:</strong><br />
                  Issiah McLean
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
