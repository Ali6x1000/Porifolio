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
    return []
  }
}

// Write projects to file
async function writeProjects(projects: Project[]): Promise<void> {
  await ensureDataDirectory()
  await writeFile(projectsFilePath, JSON.stringify(projects, null, 2))
}

// GET /api/projects
export async function GET() {
  try {
    const projects = await readProjects()
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
    const projects = await readProjects()
    
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
    
    await writeProjects(projects)
    return NextResponse.json(project)
  } catch (error) {
    console.error('Save project error:', error)
    return NextResponse.json({ error: 'Failed to save project' }, { status: 500 })
  }
}