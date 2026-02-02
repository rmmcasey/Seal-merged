'use client';

import { motion } from 'framer-motion';
import { Upload, Settings, CheckCircle } from 'lucide-react';

const steps = [
  {
    number: '1',
    icon: Upload,
    title: 'Upload File',
    description: 'Drag or select any file. Encryption happens instantly in your browser before upload.',
  },
  {
    number: '2',
    icon: Settings,
    title: 'Choose Settings',
    description: 'Set who can open it and when it expires. Simple controls, powerful security.',
  },
  {
    number: '3',
    icon: CheckCircle,
    title: 'Send & Done',
    description: 'They get a secure link. Only authorized recipients can decrypt and view the file.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Secure files in <span className="text-primary">3 clicks</span>
            <br />
            —no IT support needed
          </h2>
          <p className="text-lg md:text-xl text-slate-600">
            Your team can start encrypting files in seconds. Zero training required.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-4 mb-16 relative">
          {/* Connection lines (desktop only) */}
          <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" style={{ width: '85%', left: '7.5%' }} />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow relative z-10">
                {/* Step number badge */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 mt-4">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Arrow (desktop only, not after last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-0">
                  <svg
                    className="w-12 h-12 text-primary/30"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-primary/20">
            <p className="text-lg md:text-xl text-slate-700 leading-relaxed mb-6">
              <span className="font-semibold text-slate-900">Files are encrypted in the browser</span> before leaving the user's computer. Not even Seal can decrypt them.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary/10 text-primary font-semibold rounded-lg hover:bg-primary/20 transition-colors"
            >
              Try Interactive Demo
              <svg
                className="w-5 h-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </motion.button>
            <p className="text-sm text-slate-500 mt-3">No signup required</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
