'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Code, Database, Globe, Github, ExternalLink } from 'lucide-react'
import { useState, useEffect } from 'react'

// Add the Project interface to match the projects page
interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  github: string
  demo: string | null
  image: string
}

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const skills = [
    { icon: Code, name: 'Programming', desc: 'JavaScript, Python, Java, C++' },
    { icon: Globe, name: 'Web Development', desc: 'React, Next.js, Node.js' },
    { icon: Database, name: 'Database', desc: 'MongoDB, PostgreSQL, MySQL' },
  ]

  useEffect(() => {
    fetchFeaturedProjects()
  }, [])

  const fetchFeaturedProjects = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        const projects = Array.isArray(data) ? data : []
        // Sort projects to show newest first, assuming larger IDs or last added are newest
        const sortedProjects = projects.reverse()
        // Get the most recent 3 projects
        setFeaturedProjects(sortedProjects.slice(0, 3))
      } else {
        // Fallback to default projects if API fails
        setFeaturedProjects(getDefaultProjects())
      }
    } catch (error) {
      console.error('Failed to fetch featured projects:', error)
      setFeaturedProjects(getDefaultProjects())
    } finally {
      setLoading(false)
    }
  }

  const getDefaultProjects = (): Project[] => [
    {
      id: '1',
      title: 'Computer Vision SmartLabeler',
      description: 'Built an interface on top of Label-Studio to automate annotations, reducing cost and manpower for labeling images.',
      technologies: ['PyTorch', 'Python', 'Docker', 'API'],
      github: 'https://github.com/alinawaf/smartlabeler',
      demo: null,
      image: '/api/placeholder/400/250'
    },
    {
      id: '2',
      title: 'ElectroVector App',
      description: 'Data analytics Swift + Python app converting ECGs into vectorcardiograms, extracting clinically meaningful metrics.',
      technologies: ['Swift', 'Python', 'API', 'Healthcare'],
      github: 'https://github.com/alinawaf/electrovector',
      demo: null,
      image: '/api/placeholder/400/250'
    },
    {
      id: '3',
      title: 'Hockey Analytics ML',
      description: 'Computer vision models for real-time video analysis, achieving 3× accuracy gains and faster inference speed.',
      technologies: ['PyTorch', 'TensorFlow', 'iOS', 'ML'],
      github: 'https://github.com/alinawaf/hockey-ml',
      demo: null,
      image: '/api/placeholder/400/250'
    }
  ]

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="section-padding min-h-[90vh] flex items-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center md:text-left">
              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6"
              >
                Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">Ali Nawaf</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl"
              >
                Computer Science student passionate about creating innovative solutions 
                and building impactful software applications.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
              >
                <Link href="/projects" className="btn-primary inline-flex items-center hover:scale-105 transition-transform shadow-lg hover:shadow-primary-500/50">
                  View Projects <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
                <Link href="/resume" className="btn-secondary hover:scale-105 transition-transform shadow-lg">
                  Download Resume
                </Link>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex-1 flex justify-center md:justify-end"
            >
              <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-white shadow-2xl hover:scale-105 transition-transform duration-500">
                {/* Replace '/profile.jpeg' with your actual image path in the public folder */}
                <img 
                  src="/profile.jpeg" 
                  alt="Ali Nawaf" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/api/placeholder/400/400'
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    {/* AliJR Section */}
    <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">
              AliJR: The RAG-Enabled Voice Clone
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              A high-fidelity, real-time AI agent built with LiveKit and Google Gemini. Trained on my research papers, coursework, and professional experience at Trek Health and Houston Methodist.
            </p>
            <div className="mt-6">
              <Link
                href="/alijr"
                className="inline-block bg-primary-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-primary-700 transition"
              >
                Enter the Lab
              </Link>
            </div>
            <div className="mt-4">
              <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                Live
              </span>
            </div>
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
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="card text-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
              >
                <skill.icon className="mx-auto mb-6 text-primary-600 dark:text-primary-400" size={56} />
                <h3 className="text-xl font-semibold mb-2">{skill.name}</h3>
                <p className="text-gray-600 dark:text-gray-300">{skill.desc}</p>
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
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading projects...</p>
            </div>
          ) : featuredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No projects available yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card group hover:shadow-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 transition-all duration-300"
                >
                  <div className="h-56 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-6 flex items-center justify-center overflow-hidden relative">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300 z-10" />
                    {project.image && project.image !== '/api/placeholder/400/250' ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                          const parent = (e.target as HTMLImageElement).parentElement
                          if (parent) {
                            parent.innerHTML = '<div class="flex items-center justify-center w-full h-full"><svg class="text-primary-600" width="48" height="48" fill="currentColor" viewBox="0 0 24 24"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg></div>'
                          }
                        }}
                      />
                    ) : (
                      <Code className="text-primary-600" size={48} />
                    )}
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
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
          )}
          
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