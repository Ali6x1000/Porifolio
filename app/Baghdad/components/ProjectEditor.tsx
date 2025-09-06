'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Save } from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  github: string
  demo: string | null
  image: string
}

export default function ProjectEditor() {
  const [projects, setProjects] = useState<Project[]>([])
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    const savedProjects = localStorage.getItem('projects')
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    } else {
      // Initialize with default projects
      const defaultProjects: Project[] = [
        {
          id: '1',
          title: 'E-Commerce Platform',
          description: 'Full-stack e-commerce application with user authentication, payment processing, and admin dashboard.',
          technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
          github: 'https://github.com/yourusername/ecommerce',
          demo: 'https://your-ecommerce-demo.com',
          image: '/api/placeholder/400/250'
        }
      ]
      setProjects(defaultProjects)
      localStorage.setItem('projects', JSON.stringify(defaultProjects))
    }
  }, [])

  const saveProjects = (updatedProjects: Project[]) => {
    setProjects(updatedProjects)
    localStorage.setItem('projects', JSON.stringify(updatedProjects))
  }

  const handleSave = (project: Project) => {
    if (isCreating) {
      const newProject = { ...project, id: Date.now().toString() }
      saveProjects([...projects, newProject])
      setIsCreating(false)
    } else {
      const updatedProjects = projects.map(p => p.id === project.id ? project : p)
      saveProjects(updatedProjects)
    }
    setEditingProject(null)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      const updatedProjects = projects.filter(p => p.id !== id)
      saveProjects(updatedProjects)
    }
  }

  const createNewProject = () => {
    const newProject: Project = {
      id: '',
      title: '',
      description: '',
      technologies: [],
      github: '',
      demo: null,
      image: '/api/placeholder/400/250'
    }
    setEditingProject(newProject)
    setIsCreating(true)
  }

  if (editingProject) {
    return <ProjectForm 
      project={editingProject} 
      onSave={handleSave} 
      onCancel={() => {
        setEditingProject(null)
        setIsCreating(false)
      }} 
    />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Projects</h2>
        <button
          onClick={createNewProject}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus size={20} />
          New Project
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="card">
            <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-3">{project.description}</p>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {project.technologies.slice(0, 3).map((tech) => (
                <span key={tech} className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-xs">
                  {tech}
                </span>
              ))}
              {project.technologies.length > 3 && (
                <span className="text-xs text-gray-500">+{project.technologies.length - 3} more</span>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex gap-2 text-xs">
                <a href={project.github} className="text-primary-600">GitHub</a>
                {project.demo && <a href={project.demo} className="text-primary-600">Demo</a>}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setEditingProject(project)}
                  className="p-1 text-gray-600 hover:text-primary-600 rounded"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-1 text-gray-600 hover:text-red-600 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProjectForm({ 
  project, 
  onSave, 
  onCancel 
}: { 
  project: Project
  onSave: (project: Project) => void
  onCancel: () => void 
}) {
  const [formData, setFormData] = useState(project)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {project.id ? 'Edit Project' : 'Create New Project'}
        </h2>
        <div className="flex gap-2">
          <button onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn-primary inline-flex items-center gap-2">
            <Save size={18} />
            Save
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Project Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Technologies (comma-separated)</label>
          <input
            type="text"
            value={formData.technologies.join(', ')}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              technologies: e.target.value.split(',').map(tech => tech.trim()).filter(Boolean)
            }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="React, Node.js, MongoDB"
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">GitHub URL</label>
            <input
              type="url"
              value={formData.github}
              onChange={(e) => setFormData(prev => ({ ...prev, github: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Demo URL (optional)</label>
            <input
              type="url"
              value={formData.demo || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, demo: e.target.value || null }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Image URL</label>
          <input
            type="url"
            value={formData.image}
            onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="/api/placeholder/400/250"
          />
        </div>
      </form>
    </div>
  )
}
