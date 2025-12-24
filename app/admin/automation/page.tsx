'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Building2,
  Bot,
  Activity,
  Zap,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  Settings,
  AlertCircle,
  TrendingUp,
  Calendar,
  Bell,
  FileText,
  DollarSign,
  Users,
} from 'lucide-react'
import Link from 'next/link'

interface AutomationRule {
  id: string
  name: string
  enabled: boolean
  lastRun?: string
  status: 'active' | 'paused' | 'error'
  executions: number
}

export default function AutomationDashboard() {
  const [rules, setRules] = useState<AutomationRule[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalExecutions: 0,
    activeRules: 0,
    lastRunTime: '',
    automationHealth: 100,
  })

  useEffect(() => {
    loadAutomationData()
  }, [])

  const loadAutomationData = async () => {
    try {
      const response = await fetch('/api/automation')
      const data = await response.json()

      if (data.success) {
        setRules(data.rules.map((rule: any) => ({
          ...rule,
          status: rule.enabled ? 'active' : 'paused',
          lastRun: rule.lastRun || 'Never',
          executions: rule.executions || 0,
        })))

        // Calculate real stats from actual data
        const totalExecs = data.rules.reduce((sum: number, rule: any) => sum + (rule.executions || 0), 0)
        const activeCount = data.rules.filter((r: any) => r.enabled).length

        // Find most recent run time
        const lastRunTimes = data.rules
          .map((r: any) => r.lastRun)
          .filter((t: any) => t && t !== 'Never')
          .sort()
        const mostRecentRun = lastRunTimes.length > 0 ? lastRunTimes[lastRunTimes.length - 1] : 'Never'

        setStats({
          totalExecutions: totalExecs,
          activeRules: activeCount,
          lastRunTime: mostRecentRun,
          automationHealth: 100,
        })
      }
    } catch (error) {
      console.error('Failed to load automation data:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleRule = async (ruleId: string, enabled: boolean) => {
    try {
      await fetch('/api/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle-rule',
          ruleId,
          data: { enabled: !enabled },
        }),
      })

      setRules(rules.map(rule =>
        rule.id === ruleId
          ? { ...rule, enabled: !enabled, status: !enabled ? 'active' : 'paused' }
          : rule
      ))
    } catch (error) {
      console.error('Failed to toggle rule:', error)
    }
  }

  const triggerRule = async (ruleId: string) => {
    try {
      await fetch('/api/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'trigger-rule',
          ruleId,
        }),
      })

      alert('Rule triggered successfully!')
    } catch (error) {
      console.error('Failed to trigger rule:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/admin" className="mr-4 text-slate-600 hover:text-blue-600">
                ← Back to Dashboard
              </Link>
              <Bot className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Automation Engine</h1>
                <p className="text-sm text-slate-600">In-house intelligent automation system</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                <Activity className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-semibold text-green-700">System Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-slate-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-1">Total Executions</p>
            <p className="text-3xl font-bold text-slate-900">{stats.totalExecutions}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-slate-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-1">Active Rules</p>
            <p className="text-3xl font-bold text-slate-900">{stats.activeRules}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-slate-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-1">System Health</p>
            <p className="text-3xl font-bold text-slate-900">{stats.automationHealth}%</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-slate-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-1">Last Run</p>
            <p className="text-lg font-bold text-slate-900">{stats.lastRunTime}</p>
          </motion.div>
        </div>

        {/* What is This Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 mb-8 text-white"
        >
          <div className="flex items-start">
            <Bot className="h-12 w-12 mr-4 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold mb-3">Your In-House Automation Engine</h2>
              <p className="text-blue-100 mb-4 leading-relaxed">
                This is the "brain" of your application. It automatically manages workflows, sends notifications,
                updates statuses, and handles business logic without any external API calls. Everything runs
                in-house and is fully under your control.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Automatic Payment Reminders</p>
                    <p className="text-sm text-blue-100">Sends notifications 7, 3, and 1 day before payments</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Smart Status Updates</p>
                    <p className="text-sm text-blue-100">Automatically updates contract and payment statuses</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Document Expiration Tracking</p>
                    <p className="text-sm text-blue-100">Reminds subcontractors about expiring documents</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Welcome Workflows</p>
                    <p className="text-sm text-blue-100">Automatically onboards new subcontractors</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Automation Rules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-slate-200 p-6"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-6">Automation Rules</h2>

          <div className="space-y-4">
            {rules.map((rule, index) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border border-slate-200 rounded-lg p-6 hover:border-blue-300 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className={`p-3 rounded-lg ${
                      rule.status === 'active' ? 'bg-green-100' :
                      rule.status === 'paused' ? 'bg-slate-100' :
                      'bg-red-100'
                    }`}>
                      {rule.status === 'active' && <Activity className="h-6 w-6 text-green-600" />}
                      {rule.status === 'paused' && <Pause className="h-6 w-6 text-slate-600" />}
                      {rule.status === 'error' && <AlertCircle className="h-6 w-6 text-red-600" />}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-1">{rule.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-slate-600">
                        <span>Last run: {rule.lastRun}</span>
                        <span>•</span>
                        <span>{rule.executions} executions</span>
                        <span>•</span>
                        <span className={`font-semibold ${
                          rule.status === 'active' ? 'text-green-600' :
                          rule.status === 'paused' ? 'text-slate-600' :
                          'text-red-600'
                        }`}>
                          {rule.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => triggerRule(rule.id)}
                      className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-semibold text-sm flex items-center"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Run Now
                    </button>
                    <button
                      onClick={() => toggleRule(rule.id, rule.enabled)}
                      className={`px-4 py-2 rounded-lg transition font-semibold text-sm ${
                        rule.enabled
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                    >
                      {rule.enabled ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white rounded-xl shadow-lg border border-slate-200 p-6"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-6">Manual Workflow Triggers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-6 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group">
              <DollarSign className="h-8 w-8 text-slate-600 group-hover:text-blue-600 mb-3" />
              <span className="font-semibold text-slate-700 group-hover:text-blue-600 text-center">
                Process Payment
              </span>
            </button>
            <button className="flex flex-col items-center p-6 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group">
              <Users className="h-8 w-8 text-slate-600 group-hover:text-blue-600 mb-3" />
              <span className="font-semibold text-slate-700 group-hover:text-blue-600 text-center">
                Onboard Subcontractor
              </span>
            </button>
            <button className="flex flex-col items-center p-6 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group">
              <Bell className="h-8 w-8 text-slate-600 group-hover:text-blue-600 mb-3" />
              <span className="font-semibold text-slate-700 group-hover:text-blue-600 text-center">
                Send Reminder
              </span>
            </button>
            <button className="flex flex-col items-center p-6 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group">
              <FileText className="h-8 w-8 text-slate-600 group-hover:text-blue-600 mb-3" />
              <span className="font-semibold text-slate-700 group-hover:text-blue-600 text-center">
                Update Contract
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
