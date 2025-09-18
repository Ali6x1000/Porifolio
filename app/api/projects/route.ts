import { NextRequest, NextResponse } from 'next/server'
import { put, list, del } from '@vercel/blob'

interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  github: string
  demo: string | null
  image: string
}

const PROJECTS_BLOB_KEY = 'projects.json'

// Helper function to get projects from Vercel Blob
async function getProjects(): Promise<Project[]> {
  try {
    const { blobs } = await list({ prefix: PROJECTS_BLOB_KEY })
    if (blobs.length === 0) {
      return []
    }
    
    const response = await fetch(blobs[0].url)
    const projects = await response.json()
    return Array.isArray(projects) ? projects : []
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}

// Helper function to save projects to Vercel Blob
async function saveProjects(projects: Project[]): Promise<void> {
  try {
    // Delete existing projects blob
    const { blobs } = await list({ prefix: PROJECTS_BLOB_KEY })
    for (const blob of blobs) {
      await del(blob.url)
    }
    
    // Save new projects
    await put(PROJECTS_BLOB_KEY, JSON.stringify(projects, null, 2), {
      access: 'public',
      allowOverwrite: true,
    })
  } catch (error) {
    console.error('Error saving projects:', error)
    throw error
  }
}

// GET /api/projects
export async function GET() {
  try {
    const projects = await getProjects()
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Get projects error:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

// POST /api/projects
export async function POST(request: NextRequest) {
  try {
    const newProject = await request.json()
    const projects = await getProjects()
    
    // Generate ID if not provided
    const project: Project = {
      ...newProject,
      id: newProject.id || Date.now().toString()
    }
    
    // Check if project with this ID already exists (for updates)
    const existingIndex = projects.findIndex(p => p.id === project.id)
    
    if (existingIndex >= 0) {
      // Update existing project
      projects[existingIndex] = project
    } else {
      // Add new project
      projects.push(project)
    }
    
    await saveProjects(projects)
    return NextResponse.json(project)
  } catch (error) {
    console.error('Save project error:', error)
    return NextResponse.json({ error: 'Failed to save project' }, { status: 500 })
  }
}