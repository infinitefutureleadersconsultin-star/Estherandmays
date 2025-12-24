'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Building2,
  Shield,
  DollarSign,
  Users,
  CheckCircle,
  ArrowRight,
  MessageSquare,
  FileText,
  Clock
} from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [showAuthModal, setShowAuthModal] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-slate-900">The Esther & Mays Group</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-blue-600 font-medium transition">Features</a>
              <a href="#how-it-works" className="text-slate-600 hover:text-blue-600 font-medium transition">How It Works</a>
              <a href="#contact" className="text-slate-600 hover:text-blue-600 font-medium transition">Contact</a>
              <Link
                href="/auth/login"
                className="text-slate-600 hover:text-blue-600 font-medium transition"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-600/30"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Professional Procurement
              <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Made Seamless
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              We represent organizations with significant purchasing needs, connecting qualified vendors with substantial fulfillment opportunities. Streamlined communication, automated payments, and total transparency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition shadow-xl shadow-blue-600/30 flex items-center justify-center group"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition" />
              </Link>
              <a
                href="#how-it-works"
                className="bg-white text-slate-900 px-8 py-4 rounded-lg font-semibold hover:bg-slate-50 transition shadow-lg border-2 border-slate-200"
              >
                Learn More
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Everything You Need</h2>
            <p className="text-xl text-slate-600">Powerful tools for seamless procurement coordination</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: MessageSquare,
                title: 'Real-Time Communication',
                description: 'Dedicated communication channels for each fulfillment partner. Send updates, requirement changes, and payment notifications instantly.'
              },
              {
                icon: DollarSign,
                title: 'Automated Payments',
                description: 'Integrated Bill.com payments. Schedule, track, and execute payments with one click. Full transparency for everyone.'
              },
              {
                icon: FileText,
                title: 'Project Coordination',
                description: 'Track every procurement opportunity from start to finish. Payment schedules, margins, and deliverables in one dashboard.'
              },
              {
                icon: Shield,
                title: 'Secure & Compliant',
                description: 'Bank-level security with Firebase. W-9s, insurance certificates, and ACH info encrypted and protected.'
              },
              {
                icon: Users,
                title: 'Vendor Portals',
                description: 'Each fulfillment partner gets their own dashboard. See project status, payment history, and upcoming milestones.'
              },
              {
                icon: Clock,
                title: 'Smart Notifications',
                description: 'Email and in-app alerts for payments, messages, and deadlines. Never miss an important update.'
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition group"
              >
                <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition">
                  <feature.icon className="h-7 w-7 text-blue-600 group-hover:text-white transition" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-xl text-slate-600">Simple, transparent, professional</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: '01', title: 'Procurement Opportunity', desc: 'Receive client requirements and enter project details into the system.' },
              { number: '02', title: 'Onboard Vendors', desc: 'Invite qualified fulfillment partners. They create accounts and submit documentation.' },
              { number: '03', title: 'Manage & Communicate', desc: 'Send updates and track progress in real-time through dedicated channels.' },
              { number: '04', title: 'Process Payments', desc: 'Schedule payments via Bill.com. Vendors see payment status instantly.' },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="text-6xl font-bold text-blue-100 mb-4">{step.number}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600">{step.desc}</p>
                {index < 3 && (
                  <ArrowRight className="hidden md:block absolute -right-4 top-8 h-8 w-8 text-blue-200" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join vendors who are accessing substantial procurement opportunities through our platform
            </p>
            <Link
              href="/auth/signup"
              className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition shadow-xl"
            >
              Create Your Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Get in Touch</h2>
            <p className="text-xl text-slate-600 mb-8">
              Questions about how it works? We're here to help.
            </p>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <p className="text-slate-600 mb-6">
                <strong className="text-slate-900 text-2xl">The Esther & Mays Group</strong><br />
                <span className="text-slate-500 mt-2">Charlotte, North Carolina</span>
              </p>
              <p className="text-slate-600 mb-6">
                Have questions? Our team is here to help.
              </p>
              <a
                href="mailto:estherandmays@gmail.com"
                className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-600/30"
              >
                Contact the Team
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-6 w-6 text-blue-400" />
            <span className="ml-2 text-white font-semibold">The Esther & Mays Group</span>
          </div>
          <p className="text-sm">
            © 2025 The Esther & Mays Group. Professional Procurement Solutions.
          </p>
        </div>
      </footer>
    </div>
  )
}
