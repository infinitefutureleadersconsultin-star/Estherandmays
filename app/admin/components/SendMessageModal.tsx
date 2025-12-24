'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface SendMessageModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function SendMessageModal({ isOpen, onClose, onSuccess }: SendMessageModalProps) {
  const [vendors, setVendors] = useState<any[]>([])
  const [formData, setFormData] = useState({
    recipient: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [loadingVendors, setLoadingVendors] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (isOpen) {
      loadVendors()
    }
  }, [isOpen])

  const loadVendors = async () => {
    try {
      setLoadingVendors(true)
      if (!db) return

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
    setSuccess('')
    setLoading(true)

    try {
      const selectedVendor = vendors.find(v => v.id === formData.recipient)
      if (!selectedVendor) {
        throw new Error('Please select a recipient')
      }

      // Send email via Resend
      const emailResponse = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: selectedVendor.email,
          subject: formData.subject,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1e293b;">Message from The Esther & Mays Group</h2>
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="color: #475569; line-height: 1.6; white-space: pre-wrap;">${formData.message}</p>
              </div>
              <p style="color: #64748b; font-size: 14px;">
                This message was sent from your procurement portal dashboard.
              </p>
            </div>
          `,
        }),
      })

      if (!emailResponse.ok) {
        throw new Error('Failed to send email')
      }

      setSuccess(`Message sent successfully to ${selectedVendor.email}`)

      // Reset form
      setTimeout(() => {
        setFormData({
          recipient: '',
          subject: '',
          message: '',
        })
        onSuccess()
        onClose()
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to send message')
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
            <MessageSquare className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-slate-900">Send Message</h2>
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
              Recipient *
            </label>
            <select
              value={formData.recipient}
              onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-slate-900"
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
                No vendors found. Add a vendor first to send messages.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Subject *
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-slate-900"
              placeholder="Payment Update"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Message *
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-slate-900"
              placeholder="Your message here..."
              rows={6}
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
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
