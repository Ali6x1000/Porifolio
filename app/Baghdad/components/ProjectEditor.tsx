'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Save, Github, ExternalLink, Image as ImageIcon } from 'lucide-react'

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
  const [isLoading, setIsLoading] = useState(true)

  const fetchProjects = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/projects')
      if (!response.ok) throw new Error('Network response was not ok')
      const data = await response.json()
      setProjects(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch projects:", error)
      setProjects([]) // Set to empty array on error
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleSave = async (project: Project) => {
    try {
      await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      })
      setEditingProject(null)
      fetchProjects() // Refetch to update list
    } catch (error) {
      console.error("Failed to save project:", error)
      alert("Error saving project. See console for details.")
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await fetch(`/api/projects/${id}`, { method: 'DELETE' })
        fetchProjects() // Refetch to update list
      } catch (error) {
        console.error("Failed to delete project:", error)
        alert("Error deleting project. See console for details.")
      }
    }
  }

  const createNewProject = () => {
    const newProject: Project = {
      id: '', // API will generate ID
      title: '',
      description: '',
      technologies: [],
      github: '',
      demo: null,
      image: '/api/placeholder/400/250'
    }
    setEditingProject(newProject)
  }

  if (editingProject) {
    return <ProjectForm 
      project={editingProject} 
      onSave={handleSave} 
      onCancel={() => setEditingProject(null)} 
    />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Projects ({projects.length})</h2>
        <button
          onClick={createNewProject}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus size={20} /> New Project
        </button>
      </div>

      {isLoading ? (
        <p>Loading projects...</p>
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No projects yet. Create one!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="card flex flex-col">
              <img 
                src={project.image} 
                alt={project.title} 
                className="h-40 w-full object-cover rounded-t-lg bg-gray-200"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3 flex-grow">{project.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span key={tech} className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-auto">
                  <div className="flex gap-4 text-gray-600">
                    <a href={project.github} target="_blank" rel="noopener noreferrer" title="GitHub" className="hover:text-primary-600"><Github size={20} /></a>
                    {project.demo && <a href={project.demo} target="_blank" rel="noopener noreferrer" title="Live Demo" className="hover:text-primary-600"><ExternalLink size={20} /></a>}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setEditingProject(project)} className="p-1 hover:text-primary-600 rounded"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(project.id)} className="p-1 hover:text-red-600 rounded"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ProjectForm({ 
  project, 
  onSave, 
  onCancel 
}: { 
  project: Project;
  onSave: (project: Project) => void;
  onCancel: () => void;
}) {
  // Keep a full formData object and a separate techInput string so typing commas doesn't
  // cause cursor jumps or aggressive re-parsing on every keystroke.
  const [formData, setFormData] = useState<Project>(project);
  const [isUploading, setIsUploading] = useState(false);
  const [techInput, setTechInput] = useState<string>((project.technologies || []).join(', '))

  // Sync when parent passes a new project (important when editing an existing project)
  useEffect(() => {
    setFormData(project)
    setTechInput((project.technologies || []).join(', '))
  }, [project])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });

      if (!response.ok) throw new Error('Upload failed');

      const newBlob = await response.json();
      setFormData(prev => ({ ...prev, image: newBlob.url }));
    } catch (error) {
      console.error(error);
      alert('Image upload failed!');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert techInput string into array on save
    const cleaned = techInput.split(',').map(t => t.trim()).filter(Boolean);
    onSave({ ...formData, technologies: cleaned });
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold mb-6">
        {project.id ? 'Edit Project' : 'Create New Project'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Uploader */}
        <div>
          <label className="block text-sm font-medium mb-2">Project Image</label>
          <div className="flex items-center gap-4">
            <img src={formData.image} alt="Project" className="w-32 h-20 object-cover rounded-lg bg-gray-200"/>
            <label className="btn-secondary cursor-pointer">
              <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading}/>
            </label>
          </div>
        </div>

        {/* Other Fields... */}
        <div>
          <label className="block text-sm font-medium mb-2">Project Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full p-3 border rounded-lg" required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="w-full p-3 border rounded-lg" required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Technologies (comma-separated)</label>
          <input
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="e.g. React, TypeScript, Tailwind"
            className="w-full p-3 border rounded-lg" 
          />
          <p className="text-xs text-gray-500 mt-1">Separate items with commas (they'll be parsed when you save).</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">GitHub URL</label>
            <input
              type="url"
              value={formData.github}
              onChange={(e) => setFormData(prev => ({ ...prev, github: e.target.value }))}
              className="w-full p-3 border rounded-lg" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Demo URL (optional)</label>
            <input
              type="url"
              value={formData.demo || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, demo: e.target.value || null }))}
              className="w-full p-3 border rounded-lg"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
          <button type="submit" className="btn-primary inline-flex items-center gap-2"><Save size={18} /> Save</button>
        </div>
      </form>
    </div>
  )
}