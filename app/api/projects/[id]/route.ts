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

// DELETE /api/projects/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id
    
    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    // Read existing projects
    const projects = await getProjects()
    
    // Find project to delete
    const projectIndex = projects.findIndex(p => p.id === projectId)
    
    if (projectIndex === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Remove project from array
    const deletedProject = projects.splice(projectIndex, 1)[0]
    
    // Save updated projects
    await saveProjects(projects)
    
    return NextResponse.json({ 
      message: 'Project deleted successfully',
      deletedProject 
    })
  } catch (error) {
    console.error('Delete project error:', error)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}

// GET /api/projects/[id] - Get single project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id
    const projects = await getProjects()
    const project = projects.find(p => p.id === projectId)
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    return NextResponse.json(project)
  } catch (error) {
    console.error('Get project error:', error)
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 })
  }
}

// PUT /api/projects/[id] - Update single project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id
    const updatedProject = await request.json()
    
    const projects = await getProjects()
    const projectIndex = projects.findIndex(p => p.id === projectId)
    
    if (projectIndex === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    // Update the project
    projects[projectIndex] = { ...projects[projectIndex], ...updatedProject, id: projectId }
    
    await saveProjects(projects)
    
    return NextResponse.json(projects[projectIndex])
  } catch (error) {
    console.error('Update project error:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}