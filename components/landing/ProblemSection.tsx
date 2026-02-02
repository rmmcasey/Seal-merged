'use client';

import { motion } from 'framer-motion';
import { Mail, Share2, Infinity } from 'lucide-react';

const problems = [
  {
    icon: Mail,
    title: 'Important files can leak',
    description: 'Sensitive documents can end up in the wrong hands through email forwarding or long-term storage.',
  },
  {
    icon: Share2,
    title: 'Anyone can forward without permission',
    description: 'Your sensitive file gets forwarded to who-knows-where. You have zero control.',
  },
  {
    icon: Infinity,
    title: 'Files never expire',
    description: 'Employee SSNs, financial records—all accessible indefinitely by anyone with the email.',
  },
];

export default function ProblemSection() {
  return (
    <section id="problem" className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Email wasn't designed for{' '}
            <span className="text-primary">sensitive files</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600">
            Your team sends sensitive files every day. Here's what could go wrong:
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-slate-50 rounded-2xl p-8 hover:shadow-lg transition-shadow"
            >
              <div className="w-14 h-14 bg-error/10 rounded-xl flex items-center justify-center mb-6">
                <problem.icon className="w-7 h-7 text-error" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {problem.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
