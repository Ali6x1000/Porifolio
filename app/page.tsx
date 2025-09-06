'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Code, Database, Globe } from 'lucide-react'

export default function Home() {
  const skills = [
    { icon: Code, name: 'Programming', desc: 'JavaScript, Python, Java, C++' },
    { icon: Globe, name: 'Web Development', desc: 'React, Next.js, Node.js' },
    { icon: Database, name: 'Database', desc: 'MongoDB, PostgreSQL, MySQL' },
  ]

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Hi, I'm <span className="text-primary-600">Ali Nawaf</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Computer Science student passionate about creating innovative solutions 
              and building impactful software applications.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/projects" className="btn-primary inline-flex items-center">
                View Projects <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link href="/resume" className="btn-secondary">
                Download Resume
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Skills & Expertise</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card text-center"
              >
                <skill.icon className="mx-auto mb-4 text-primary-600" size={48} />
                <h3 className="text-xl font-semibold mb-2">{skill.name}</h3>
                <p className="text-gray-600">{skill.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Projects Preview */}
      <section className="section-padding bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Projects</h2>
            <p className="text-gray-600">Check out some of my recent work</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {[1, 2, 3].map((project) => (
              <div key={project} className="card">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <h3 className="text-xl font-semibold mb-2">Project {project}</h3>
                <p className="text-gray-600 mb-4">
                  A brief description of this amazing project and its features.
                </p>
                <div className="flex gap-2">
                  <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-sm">
                    React
                  </span>
                  <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-sm">
                    Node.js
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link href="/projects" className="btn-primary">
              View All Projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
