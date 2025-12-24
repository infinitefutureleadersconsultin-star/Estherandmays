'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, DollarSign, AlertCircle, CheckCircle } from 'lucide-react'
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface ProcessPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function ProcessPaymentModal({ isOpen, onClose, onSuccess }: ProcessPaymentModalProps) {
  const [vendors, setVendors] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [formData, setFormData] = useState({
    projectId: '',
    vendorId: '',
    amount: '',
    date: '',
    description: '',
  })
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen])

  const loadData = async () => {
    try {
      setLoadingData(true)
      if (!db) return

      // Load vendors
      const usersQuery = query(collection(db, 'users'), where('role', '==', 'subcontractor'))
      const usersSnapshot = await getDocs(usersQuery)
      const vendorList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setVendors(vendorList)

      // Load projects
      const projectsSnapshot = await getDocs(collection(db, 'contracts'))
      const projectList = projectsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setProjects(projectList)
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (!db) throw new Error('Database not initialized')

      const selectedVendor = vendors.find(v => v.id === formData.vendorId)
      const selectedProject = projects.find(p => p.id === formData.projectId)

      if (!selectedVendor || !selectedProject) {
        throw new Error('Please select both project and vendor')
      }

      // Create payment record in Firestore
      const paymentData = {
        projectId: formData.projectId,
        projectName: selectedProject.name,
        vendorId: formData.vendorId,
        vendorEmail: selectedVendor.email,
        vendorName: selectedVendor.displayName,
        amount: parseFloat(formData.amount),
        scheduledDate: new Date(formData.date),
        description: formData.description,
        status: 'scheduled',
        createdAt: new Date(),
      }

      await addDoc(collection(db, 'payments'), paymentData)

      // Send payment notification email
      const emailResponse = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: selectedVendor.email,
          subject: 'Payment Scheduled - The Esther & Mays Group',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #10b981;">Payment Scheduled</h2>
              <div style="background: #f0fdf4; border: 2px solid #10b981; border-radius: 10px; padding: 20px; margin: 20px 0;">
                <div style="font-size: 36px; font-weight: bold; color: #10b981; margin-bottom: 10px;">
                  $${parseFloat(formData.amount).toLocaleString()}
                </div>
                <div style="color: #475569; font-size: 18px; margin-bottom: 10px;">
                  Scheduled for: ${new Date(formData.date).toLocaleDateString()}
                </div>
                <div style="color: #64748b;">
                  Project: ${selectedProject.name}
                </div>
              </div>
              <p style="color: #475569; line-height: 1.6;">
                Good news! Your payment has been scheduled and will be processed on the date shown above.
                Funds will be deposited via ACH to your registered bank account.
              </p>
              <p style="color: #64748b; font-size: 14px;">
                Questions? Contact us at estherandmays@gmail.com
              </p>
            </div>
          `,
        }),
      })

      if (!emailResponse.ok) {
        console.error('Email failed to send')
      }

      setSuccess(`Payment of $${parseFloat(formData.amount).toLocaleString()} scheduled successfully!`)

      // Reset form
      setTimeout(() => {
        setFormData({
          projectId: '',
          vendorId: '',
          amount: '',
          date: '',
          description: '',
        })
        onSuccess()
        onClose()
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to process payment')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
          <div className="flex items-center">
            <DollarSign className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-slate-900">Process Payment</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Project *
            </label>
            <select
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-slate-900"
              required
              disabled={loadingData}
            >
              <option value="">
                {loadingData ? 'Loading projects...' : 'Select a project'}
              </option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name} - ${project.totalAmount?.toLocaleString()}
                </option>
              ))}
            </select>
            {projects.length === 0 && !loadingData && (
              <p className="text-sm text-amber-600 mt-2">
                No projects found. Create a project first.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Vendor *
            </label>
            <select
              value={formData.vendorId}
              onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-slate-900"
              required
              disabled={loadingData}
            >
              <option value="">
                {loadingData ? 'Loading vendors...' : 'Select a vendor'}
              </option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.displayName} ({vendor.email})
                </option>
              ))}
            </select>
            {vendors.length === 0 && !loadingData && (
              <p className="text-sm text-amber-600 mt-2">
                No vendors found. Add a vendor first.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Amount ($) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-slate-900"
                placeholder="25000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Payment Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-slate-900"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-slate-900"
              placeholder="e.g., Month 1 Payment"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || vendors.length === 0 || projects.length === 0}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Schedule Payment'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
