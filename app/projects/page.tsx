'use client'

import { motion } from 'framer-motion'
import { Github, ExternalLink, Code } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    const savedProjects = localStorage.getItem('projects')
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    } else {
      // Default projects if none saved
      const defaultProjects = [
        {
          title: 'E-Commerce Platform',
          description: 'Full-stack e-commerce application with user authentication, payment processing, and admin dashboard.',
          technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
          github: 'https://github.com/yourusername/ecommerce',
          demo: 'https://your-ecommerce-demo.com',
          image: '/api/placeholder/400/250'
        },
        {
          title: 'Task Management App',
          description: 'Collaborative task management tool with real-time updates, drag-and-drop functionality, and team features.',
          technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Socket.io'],
          github: 'https://github.com/yourusername/taskapp',
          demo: 'https://your-taskapp-demo.com',
          image: '/api/placeholder/400/250'
        },
        {
          title: 'Weather Dashboard',
          description: 'Weather application with location-based forecasts, interactive maps, and historical data visualization.',
          technologies: ['React', 'Chart.js', 'Weather API', 'Tailwind CSS'],
          github: 'https://github.com/yourusername/weather',
          demo: 'https://your-weather-demo.com',
          image: '/api/placeholder/400/250'
        },
        {
          title: 'Machine Learning Classifier',
          description: 'Image classification model using TensorFlow with web interface for real-time predictions.',
          technologies: ['Python', 'TensorFlow', 'Flask', 'scikit-learn'],
          github: 'https://github.com/yourusername/ml-classifier',
          demo: null,
          image: '/api/placeholder/400/250'
        },
        {
          title: 'Social Media Dashboard',
          description: 'Analytics dashboard for social media metrics with data visualization and automated reporting.',
          technologies: ['Vue.js', 'Express', 'MySQL', 'D3.js'],
          github: 'https://github.com/yourusername/social-dashboard',
          demo: 'https://your-dashboard-demo.com',
          image: '/api/placeholder/400/250'
        },
        {
          title: 'Mobile Game',
          description: 'Cross-platform mobile game built with React Native featuring multiplayer capabilities.',
          technologies: ['React Native', 'Firebase', 'Redux', 'Expo'],
          github: 'https://github.com/yourusername/mobile-game',
          demo: null,
          image: '/api/placeholder/400/250'
        }
      ]
      setProjects(defaultProjects)
    }
  }, [])

  return (
    <div className="pt-16">
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">My Projects</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A collection of projects showcasing my skills in web development, 
              machine learning, and software engineering.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card group hover:scale-105 transition-transform duration-300"
              >
                <div className="h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                    <Code className="text-primary-600" size={48} />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech: string) => (
                    <span
                      key={tech}
                      className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-3">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <Github size={20} />
                    Code
                  </a>
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      <ExternalLink size={20} />
                      Demo
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
