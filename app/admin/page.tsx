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
} from 'lucide-react'
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
      title: 'Active Contracts',
      value: '12',
      change: '+3 this month',
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Subcontractors',
      value: '28',
      change: '+5 new',
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Pending Payments',
      value: '$245,000',
      change: '8 scheduled',
      icon: DollarSign,
      color: 'bg-purple-500',
    },
    {
      title: 'Unread Messages',
      value: '7',
      change: '3 urgent',
      icon: MessageSquare,
      color: 'bg-orange-500',
    },
  ]

  const recentContracts = [
    {
      id: 'NC-ENV-001',
      name: 'VA Medical Center - Environmental Services',
      subcontractor: 'CleanPro Services',
      amount: '$120,000',
      status: 'active',
      nextPayment: 'Dec 3, 2025',
    },
    {
      id: 'NC-SEC-002',
      name: 'Federal Building - Security Services',
      subcontractor: 'SecureGuard Inc',
      amount: '$85,000',
      status: 'active',
      nextPayment: 'Dec 10, 2025',
    },
    {
      id: 'NC-MNT-003',
      name: 'Post Office - Maintenance',
      subcontractor: 'Facility Masters',
      amount: '$45,000',
      status: 'pending',
      nextPayment: 'Dec 15, 2025',
    },
  ]

  const recentMessages = [
    {
      from: 'CleanPro Services',
      message: 'Updated W-9 form submitted',
      time: '10 minutes ago',
      unread: true,
    },
    {
      from: 'SecureGuard Inc',
      message: 'Question about payment schedule',
      time: '2 hours ago',
      unread: true,
    },
    {
      from: 'Facility Masters',
      message: 'Insurance certificate renewed',
      time: '1 day ago',
      unread: false,
    },
  ]

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
              <button className="relative p-2 text-slate-600 hover:text-blue-600 transition">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
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
            Welcome back, {user?.displayName}!
          </h1>
          <p className="text-slate-600">Here's what's happening with your contracts today.</p>
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
                <h2 className="text-xl font-bold text-slate-900">Recent Contracts</h2>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  <Plus className="h-4 w-4 mr-2" />
                  New Contract
                </button>
              </div>

              <div className="space-y-4">
                {recentContracts.map((contract, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-slate-900">{contract.name}</p>
                        <p className="text-sm text-slate-500">ID: {contract.id}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          contract.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {contract.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">{contract.subcontractor}</span>
                      <span className="font-semibold text-slate-900">{contract.amount}</span>
                    </div>
                    <div className="flex items-center mt-2 text-xs text-slate-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      Next payment: {contract.nextPayment}
                    </div>
                  </motion.div>
                ))}
              </div>

              <button className="w-full mt-4 py-2 text-blue-600 hover:text-blue-700 font-semibold">
                View All Contracts →
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group">
                  <DollarSign className="h-5 w-5 text-slate-600 group-hover:text-blue-600 mr-3" />
                  <span className="font-semibold text-slate-700 group-hover:text-blue-600">
                    Process Payment
                  </span>
                </button>
                <button className="flex items-center p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group">
                  <Users className="h-5 w-5 text-slate-600 group-hover:text-blue-600 mr-3" />
                  <span className="font-semibold text-slate-700 group-hover:text-blue-600">
                    Add Subcontractor
                  </span>
                </button>
                <button className="flex items-center p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group">
                  <MessageSquare className="h-5 w-5 text-slate-600 group-hover:text-blue-600 mr-3" />
                  <span className="font-semibold text-slate-700 group-hover:text-blue-600">
                    Send Update
                  </span>
                </button>
                <button className="flex items-center p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group">
                  <FileText className="h-5 w-5 text-slate-600 group-hover:text-blue-600 mr-3" />
                  <span className="font-semibold text-slate-700 group-hover:text-blue-600">
                    Generate Report
                  </span>
                </button>
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

              <div className="space-y-4">
                {recentMessages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
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
                  </motion.div>
                ))}
              </div>

              <button className="w-full mt-4 py-2 text-blue-600 hover:text-blue-700 font-semibold">
                View All Messages →
              </button>
            </div>

            {/* Upcoming Payments */}
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center mb-4">
                <DollarSign className="h-6 w-6 mr-2" />
                <h3 className="text-lg font-bold">Upcoming Payments</h3>
              </div>
              <p className="text-3xl font-bold mb-2">$125,000</p>
              <p className="text-blue-100 mb-4">Due in next 7 days</p>
              <button className="w-full bg-white text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-50 transition">
                Review Schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
