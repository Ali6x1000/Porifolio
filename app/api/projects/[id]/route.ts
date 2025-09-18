import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile } from 'fs/promises'
import path from 'path'

interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  github: string
  demo: string | null
  image: string
}

const projectsFilePath = path.join(process.cwd(), 'data', 'projects.json')

// Ensure data directory exists
async function ensureDataDirectory() {
  const fs = require('fs')
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Read projects from file
async function readProjects(): Promise<Project[]> {
  try {
    await ensureDataDirectory()
    const data = await readFile(projectsFilePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    // File doesn't exist or is empty, return empty array
    return []
  }
}

// Write projects to file
async function writeProjects(projects: Project[]): Promise<void> {
  await ensureDataDirectory()
  await writeFile(projectsFilePath, JSON.stringify(projects, null, 2))
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
    const projects = await readProjects()
    
    // Find project to delete
    const projectIndex = projects.findIndex(p => p.id === projectId)
    
    if (projectIndex === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Remove project from array
    const deletedProject = projects.splice(projectIndex, 1)[0]
    
    // Write updated projects back to file
    await writeProjects(projects)
    
    return NextResponse.json({ 
      message: 'Project deleted successfully',
      deletedProject 
    })
  } catch (error) {
    console.error('Delete project error:', error)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}

// GET /api/projects/[id] - Get single project (optional)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id
    const projects = await readProjects()
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

// PUT /api/projects/[id] - Update single project (optional)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id
    const updatedProject = await request.json()
    
    const projects = await readProjects()
    const projectIndex = projects.findIndex(p => p.id === projectId)
    
    if (projectIndex === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    // Update the project
    projects[projectIndex] = { ...projects[projectIndex], ...updatedProject, id: projectId }
    
    await writeProjects(projects)
    
    return NextResponse.json(projects[projectIndex])
  } catch (error) {
    console.error('Update project error:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}