'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, FileText, AlertCircle, Users } from 'lucide-react'
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function CreateProjectModal({ isOpen, onClose, onSuccess }: CreateProjectModalProps) {
  const [vendors, setVendors] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    amount: '',
    startDate: '',
    endDate: '',
    vendorId: '',
  })
  const [loading, setLoading] = useState(false)
  const [loadingVendors, setLoadingVendors] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      loadVendors()
    }
  }, [isOpen])

  const loadVendors = async () => {
    try {
      setLoadingVendors(true)
      if (!db) return

      // Load all subcontractor/vendor users
      const usersQuery = query(collection(db, 'users'), where('role', '==', 'subcontractor'))
      const snapshot = await getDocs(usersQuery)
      const vendorList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setVendors(vendorList)
    } catch (err) {
      console.error('Failed to load vendors:', err)
    } finally {
      setLoadingVendors(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!db) throw new Error('Database not initialized')

      if (!formData.vendorId) {
        throw new Error('Please select a vendor to assign this project to')
      }

      const selectedVendor = vendors.find(v => v.id === formData.vendorId)

      const contractData = {
        name: formData.name,
        description: formData.description,
        totalAmount: parseFloat(formData.amount),
        paidToDate: 0,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        status: 'active',
        vendorId: formData.vendorId,
        vendorEmail: selectedVendor?.email || '',
        vendorName: selectedVendor?.displayName || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await addDoc(collection(db, 'contracts'), contractData)

      // Send notification email to vendor
      if (selectedVendor?.email) {
        await fetch('/api/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: selectedVendor.email,
            subject: 'New Project Assigned - The Esther & Mays Group',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">New Project Assigned!</h2>
                <div style="background: #eff6ff; border: 2px solid #2563eb; border-radius: 10px; padding: 20px; margin: 20px 0;">
                  <h3 style="color: #1e40af; margin-top: 0;">${formData.name}</h3>
                  <p style="color: #475569; margin: 10px 0;">
                    <strong>Description:</strong> ${formData.description || 'Government Procurement Project'}
                  </p>
                  <p style="color: #475569; margin: 10px 0;">
                    <strong>Total Value:</strong> $${parseFloat(formData.amount).toLocaleString()}
                  </p>
                  <p style="color: #475569; margin: 10px 0;">
                    <strong>Start Date:</strong> ${new Date(formData.startDate).toLocaleDateString()}
                  </p>
                  <p style="color: #475569; margin: 10px 0;">
                    <strong>End Date:</strong> ${new Date(formData.endDate).toLocaleDateString()}
                  </p>
                </div>
                <p style="color: #475569; line-height: 1.6;">
                  You've been assigned to a new project! Log in to your vendor portal to view full project details and track payments.
                </p>
                <p style="color: #64748b; font-size: 14px;">
                  Questions? Contact us at estherandmays@gmail.com
                </p>
              </div>
            `,
          }),
        }).catch(err => console.error('Email failed:', err))
      }

      // Reset form
      setFormData({
        name: '',
        description: '',
        amount: '',
        startDate: '',
        endDate: '',
        vendorId: '',
      })

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to create project')
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
            <FileText className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-slate-900">Create New Project</h2>
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

          {/* VENDOR SELECTION - NEW FEATURE */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Users className="h-5 w-5 text-blue-600 mr-2" />
              <h4 className="font-semibold text-slate-900">Assign to Vendor</h4>
            </div>
            <p className="text-sm text-slate-600 mb-3">
              Select which vendor will fulfill this project
            </p>
            <select
              value={formData.vendorId}
              onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-slate-900 bg-white"
              required
              disabled={loadingVendors}
            >
              <option value="">
                {loadingVendors ? 'Loading vendors...' : 'Select a vendor'}
              </option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.displayName} ({vendor.email})
                </option>
              ))}
            </select>
            {vendors.length === 0 && !loadingVendors && (
              <p className="text-sm text-amber-600 mt-2">
                ⚠️ No vendors found. Vendors need to sign up first, or use "Add Vendor" to invite them.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-slate-900"
              placeholder="e.g., Government Facility Janitorial Services"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-slate-900"
              placeholder="Brief description of the project scope..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Total Amount ($) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-slate-900"
                placeholder="100000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-slate-900"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              End Date *
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-slate-900"
              required
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
              disabled={loading || vendors.length === 0}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create & Assign Project'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
