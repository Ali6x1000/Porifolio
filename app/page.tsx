'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Code, Database, Globe, Github, ExternalLink, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '../lib/utils'

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
        const sortedProjects = projects.reverse()
        setFeaturedProjects(sortedProjects.slice(0, 3))
      } else {
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
    <div className="relative w-full min-h-screen bg-background">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] z-0 pointer-events-none dark:block hidden" />
      <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:50px_50px] z-0 pointer-events-none dark:hidden block" />
      
      {/* Hero Section */}
      <section className="relative z-10 min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex justify-center"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-sm font-medium border border-border">
              <Sparkles size={16} className="text-primary" />
              Machine Learning , Artificial Inteligence and Math enthusiast
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8"
          >
            Hi, I'm <span className="text-gradient">Ali Nawaf</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
          >
            Computer Science student passionate about creating innovative solutions, 
            artificial intelligence, and building impactful software applications.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/projects" className="btn-primary group h-12 px-8 text-base rounded-full">
              View Projects 
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/resume" className="btn-secondary h-12 px-8 text-base rounded-full">
              Download Resume
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Agentic Twin Spotlight Section */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden border border-border bg-card/50 backdrop-blur-sm p-8 md:p-12 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-wider mb-4 border border-green-500/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Live AI Agent
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Agentic Twin
                </h2>
                <p className="text-muted-foreground text-lg mb-6 max-w-xl">
                  An AI agent with access to my resume, project repos, research and coursework.
                  Chat or talk by voice in real time, or run its RAG tools yourself with / commands.
                </p>
                <Link
                  href="/twin"
                  className="btn-primary"
                >
                  Try the Agentic Twin
                </Link>
              </div>
              <div className="flex-1 flex justify-center w-full max-w-sm">
                 <div className="w-full aspect-square rounded-2xl bg-gradient-to-tr from-primary/20 to-purple-500/20 border border-white/10 flex items-center justify-center shadow-inner relative overflow-hidden">
                    <Sparkles className="w-16 h-16 text-primary animate-pulse" />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Bento Grid */}
      <section className="relative z-10 py-24 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Skills & Expertise</h2>
            <p className="text-muted-foreground">What I bring to the table</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group relative rounded-2xl border border-border bg-card p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <skill.icon size={100} />
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <skill.icon className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{skill.name}</h3>
                <p className="text-muted-foreground">{skill.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Work</h2>
              <p className="text-muted-foreground">Some of my recent projects</p>
            </div>
            <Link href="/projects" className="hidden md:flex text-sm font-medium text-primary hover:underline items-center gap-1">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex flex-col rounded-2xl border border-border bg-card overflow-hidden group hover:shadow-xl transition-all"
                >
                  <div className="h-48 w-full bg-muted relative overflow-hidden flex items-center justify-center">
                    {project.image && project.image !== '/api/placeholder/400/250' ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <Code className="text-muted-foreground/30" size={48} />
                    )}
                  </div>
                  
                  <div className="flex flex-col flex-1 p-6">
                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                    <p className="text-muted-foreground text-sm mb-6 flex-1 line-clamp-3">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span key={tech} className="px-2 py-1 bg-secondary rounded-md text-xs font-medium text-secondary-foreground">
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-4 mt-auto">
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                          <Github size={20} />
                        </a>
                      )}
                      {project.demo && (
                        <a href={project.demo} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                          <ExternalLink size={20} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="mt-8 md:hidden text-center">
             <Link href="/projects" className="btn-secondary w-full">
               View All Projects
             </Link>
          </div>
        </div>
      </section>
    </div>
  )
}