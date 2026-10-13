'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { SkillsSection } from './components/SkillsSection'
import { ProjectCard } from './components/projects/ProjectCard'
import { PROJECTS } from '../lib/projects'

const featuredProjects = PROJECTS.filter((project) => project.featured)

export default function Home() {
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
              <Sparkles size={16} className="text-brand" />
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
            <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-transparent pointer-events-none" />
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
                <div className="flex flex-wrap justify-center gap-3 md:justify-start">
                  <Link href="/twin" className="btn-primary">
                    Try the Agentic Twin
                  </Link>
                  <Link href="/projects#agentic-twin" className="btn-secondary">
                    How it&apos;s built
                  </Link>
                </div>
              </div>
              <div className="flex-1 flex justify-center w-full max-w-sm">
                 <div className="w-full aspect-square rounded-2xl bg-gradient-to-tr from-brand/20 to-purple-500/20 border border-border flex items-center justify-center shadow-inner relative overflow-hidden">
                    <Sparkles className="w-16 h-16 text-brand animate-pulse" />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SkillsSection />

      {/* Featured Projects */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Work</h2>
              <p className="text-muted-foreground">Selected AI safety and medical AI work</p>
            </div>
            <Link href="/projects" className="hidden md:flex text-sm font-medium text-brand hover:underline items-center gap-1">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex"
              >
                <ProjectCard project={project} compact className="w-full" />
              </motion.div>
            ))}
          </div>

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