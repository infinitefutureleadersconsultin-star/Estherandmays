'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Building2,
  Users,
  DollarSign,
  FileText,
  MessageSquare,
  Bell,
  Search,
  Plus,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  LogOut,
  Bot,
} from 'lucide-react'
import Link from 'next/link'
import { useAuthStore } from '@/lib/store'
import { logoutUser } from '@/lib/auth'

export default function AdminDashboard() {
  const router = useRouter()
  const { user, setUser } = useAuthStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
    } else if (user.role !== 'admin') {
      router.push('/portal')
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

  const stats = [
    {
      title: 'Active Projects',
      value: '0',
      change: 'Ready to start',
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Vendors',
      value: '0',
      change: 'Add your first vendor',
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Pending Payments',
      value: '$0',
      change: 'No payments scheduled',
      icon: DollarSign,
      color: 'bg-purple-500',
    },
    {
      title: 'Unread Messages',
      value: '0',
      change: 'All caught up',
      icon: MessageSquare,
      color: 'bg-orange-500',
    },
  ]

  const recentContracts: any[] = []

  const recentMessages: any[] = []

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-slate-900">Admin Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => alert('Notifications feature coming soon!')}
                className="relative p-2 text-slate-600 hover:text-blue-600 transition"
              >
                <Bell className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{user?.displayName}</p>
                  <p className="text-xs text-slate-500">Administrator</p>
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
            Welcome, {user?.displayName}!
          </h1>
          <p className="text-slate-600">Your procurement management portal is ready. Start by creating your first project.</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-slate-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.change}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contracts Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Projects</h2>
                <button
                  onClick={() => alert('Project creation feature coming soon! This will allow you to add new procurement opportunities and invite vendors.')}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </button>
              </div>

              {recentContracts.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No Projects Yet</h3>
                  <p className="text-slate-600 mb-6">
                    Get started by creating your first procurement project
                  </p>
                  <button
                    onClick={() => alert('Project creation feature coming soon!')}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create Your First Project
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentContracts.map((contract, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-4">
                      <p>{contract.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => alert('Payment processing feature coming soon! This will integrate with Bill.com for ACH payments.')}
                  className="flex items-center p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group"
                >
                  <DollarSign className="h-5 w-5 text-slate-600 group-hover:text-blue-600 mr-3" />
                  <span className="font-semibold text-slate-700 group-hover:text-blue-600">
                    Process Payment
                  </span>
                </button>
                <button
                  onClick={() => alert('Vendor onboarding feature coming soon! This will allow you to invite fulfillment partners and manage their profiles.')}
                  className="flex items-center p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group"
                >
                  <Users className="h-5 w-5 text-slate-600 group-hover:text-blue-600 mr-3" />
                  <span className="font-semibold text-slate-700 group-hover:text-blue-600">
                    Add Vendor
                  </span>
                </button>
                <button
                  onClick={() => alert('Messaging feature coming soon! This will allow you to send updates and notifications to vendors via Resend.')}
                  className="flex items-center p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group"
                >
                  <MessageSquare className="h-5 w-5 text-slate-600 group-hover:text-blue-600 mr-3" />
                  <span className="font-semibold text-slate-700 group-hover:text-blue-600">
                    Send Update
                  </span>
                </button>
                <Link
                  href="/admin/automation"
                  className="flex items-center p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group"
                >
                  <Bot className="h-5 w-5 text-slate-600 group-hover:text-blue-600 mr-3" />
                  <span className="font-semibold text-slate-700 group-hover:text-blue-600">
                    Automation Engine
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Messages Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Messages</h2>
                <MessageSquare className="h-5 w-5 text-slate-600" />
              </div>

              {recentMessages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No Messages Yet</h3>
                  <p className="text-slate-600 text-sm">
                    Messages from vendors will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentMessages.map((msg, index) => (
                    <div key={index} className="p-4 rounded-lg border">
                      <p>{msg.from}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming Payments */}
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center mb-4">
                <DollarSign className="h-6 w-6 mr-2" />
                <h3 className="text-lg font-bold">Upcoming Payments</h3>
              </div>
              <p className="text-3xl font-bold mb-2">$0</p>
              <p className="text-blue-100 mb-4">No payments scheduled</p>
              <button
                onClick={() => alert('Payment scheduling feature coming soon!')}
                className="w-full bg-white text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Schedule Payments
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
