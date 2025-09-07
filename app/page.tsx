'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Code, Database, Globe, Github, ExternalLink } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([])

  const skills = [
    { icon: Code, name: 'Programming', desc: 'JavaScript, Python, Java, C++' },
    { icon: Globe, name: 'Web Development', desc: 'React, Next.js, Node.js' },
    { icon: Database, name: 'Database', desc: 'MongoDB, PostgreSQL, MySQL' },
  ]

  useEffect(() => {
    // Get projects from localStorage and take first 3 as featured
    const savedProjects = localStorage.getItem('projects')
    if (savedProjects) {
      const projects = JSON.parse(savedProjects)
      setFeaturedProjects(projects.slice(0, 3))
    } else {
      // Default featured projects if none saved
      const defaultProjects = [
        {
          id: '1',
          title: 'Computer Vision SmartLabeler',
          description: 'Built an interface on top of Label-Studio to automate annotations, reducing cost and manpower for labeling images.',
          technologies: ['PyTorch', 'Python', 'Docker', 'API'],
          github: 'https://github.com/alinawaf/smartlabeler',
          demo: null,
        },
        {
          id: '2',
          title: 'ElectroVector App',
          description: 'Data analytics Swift + Python app converting ECGs into vectorcardiograms, extracting clinically meaningful metrics.',
          technologies: ['Swift', 'Python', 'API', 'Healthcare'],
          github: 'https://github.com/alinawaf/electrovector',
          demo: null,
        },
        {
          id: '3',
          title: 'Hockey Analytics ML',
          description: 'Computer vision models for real-time video analysis, achieving 3× accuracy gains and faster inference speed.',
          technologies: ['PyTorch', 'TensorFlow', 'iOS', 'ML'],
          github: 'https://github.com/alinawaf/hockey-ml',
          demo: null,
        }
      ]
      setFeaturedProjects(defaultProjects)
    }
  }, [])

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

      {/* Featured Projects Section */}
      <section className="section-padding bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Projects</h2>
            <p className="text-gray-600">Check out some of my recent work</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card group hover:scale-105 transition-transform duration-300"
              >
                <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-4 flex items-center justify-center">
                  <Code className="text-primary-600" size={48} />
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech: string) => (
                    <span
                      key={tech}
                      className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="text-sm text-gray-500">
                      +{project.technologies.length - 3} more
                    </span>
                  )}
                </div>
                
                <div className="flex gap-3">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors text-sm"
                    >
                      <Github size={16} />
                      Code
                    </a>
                  )}
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors text-sm"
                    >
                      <ExternalLink size={16} />
                      Demo
                    </a>
                  )}
                </div>
              </motion.div>
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
