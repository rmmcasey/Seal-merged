'use client';

import { motion } from 'framer-motion';
import { Lock, Clock, Users, ShieldCheck, BarChart3, Globe } from 'lucide-react';

const features = [
  {
    icon: Lock,
    title: 'End-to-End Encrypted',
    description: 'Files encrypted in your browser using AES-256. We can\'t read them. Ever.',
  },
  {
    icon: Clock,
    title: 'Automatic Expiration',
    description: 'Set exact expiration dates. Files auto-delete when time\'s up. No recovery possible.',
  },
  {
    icon: Users,
    title: 'Multi-Recipient',
    description: 'Share securely with multiple people. Each gets their own unique decryption key.',
  },
  {
    icon: ShieldCheck,
    title: 'Zero-Knowledge Architecture',
    description: 'We never have access to your files or encryption keys. Your data, your control.',
  },
  {
    icon: BarChart3,
    title: 'Access Logs',
    description: 'Track who opened your files and when. Full audit trail for compliance.',
  },
  {
    icon: Globe,
    title: 'Works Everywhere',
    description: 'No apps or extensions needed. Works in any modern browser, on any device.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Everything your IT team needs,{' '}
            <span className="text-primary">nothing they don't</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600">
            Enterprise-grade security with consumer-grade simplicity
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group bg-slate-50 rounded-2xl p-8 hover:bg-gradient-to-br hover:from-blue-50 hover:to-white hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all">
                <feature.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Additional badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 flex flex-wrap justify-center gap-4"
        >
          {[
            { label: 'GDPR Compliant', color: 'success' },
            { label: 'SOC 2 (In Progress)', color: 'warning' },
            { label: 'Open Source Roadmap', color: 'primary' },
          ].map((badge, index) => (
            <div
              key={index}
              className={`px-6 py-3 bg-${badge.color}/10 text-${badge.color} rounded-full font-semibold text-sm border border-${badge.color}/20`}
            >
              ✓ {badge.label}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
