import { NextRequest, NextResponse } from 'next/server'
import { put, list } from '@vercel/blob'

interface AboutData {
  profileImage: string
  name: string
  title: string
  location: string
  email: string
  phone: string
  bio: {
    introduction: string
    background: string
    interests: string
    goals: string
  }
  stats: {
    label: string
    value: string
  }[]
  personalFacts: string[]
}

const ABOUT_BLOB_KEY = 'about.json'

// Helper function to get about data from Vercel Blob
async function getAboutData(): Promise<AboutData | null> {
  try {
    const { blobs } = await list({ prefix: ABOUT_BLOB_KEY })
    if (blobs.length === 0) {
      return null
    }
    
    const response = await fetch(blobs[0].url)
    const aboutData = await response.json()
    return aboutData
  } catch (error) {
    console.error('Error fetching about data:', error)
    return null
  }
}

// Helper function to save about data to Vercel Blob
async function saveAboutData(aboutData: AboutData): Promise<void> {
  try {
    // Delete existing about blob
    const { blobs } = await list({ prefix: ABOUT_BLOB_KEY })
    for (const blob of blobs) {
      const { del } = await import('@vercel/blob')
      await del(blob.url)
    }
    
    // Save new about data
    await put(ABOUT_BLOB_KEY, JSON.stringify(aboutData, null, 2), {
      access: 'public',
    })
  } catch (error) {
    console.error('Error saving about data:', error)
    throw error
  }
}

// GET /api/about
export async function GET() {
  try {
    const aboutData = await getAboutData()
    
    if (!aboutData) {
      // Return default data if none exists
      const defaultData: AboutData = {
        profileImage: '/placeholder-avatar.jpg',
        name: 'Ali Nawaf',
        title: 'Computer Science Student & Developer',
        location: 'Cleveland, OH',
        email: 'aan90@case.edu',
        phone: '+1 (216) 647-4302',
        bio: {
          introduction: "Hello! I'm Ali, Junior at Case Western Reserve University in the BS/MS program. My thesis is in Machine Learning.",
          background: "I have experience in SWE, ML, Computer Vision and I am trying to expand into more fields like Privacy and biotech",
          interests: "When I'm not coding, I enjoy exploring nature, going on hikes, doing sports or socializing in cafes.",
          goals: "My goal is to leverage technology to create meaningful impact in the world"
        },
        stats: [
          {label : 'Industry experience' , value: '1 year +'},
          { label: 'ML Models Used', value: 'RESNETs, CNN, YOLO, VAEs' },
          { label: 'Area of Interest', value: 'Machine Learning' },
          { label: 'Coffee Cups', value: '∞' }
        ],
        personalFacts: [
          'I went to India for high school',
          'I was a biochem pre med major still passionate for medicine and health',
          'I love coffee chats',
          'I am Bilingual Arabic + English',
          'I have 700 liked spotify songs'
        ]
      }
      return NextResponse.json(defaultData)
    }
    
    return NextResponse.json(aboutData)
  } catch (error) {
    console.error('Get about data error:', error)
    return NextResponse.json({ error: 'Failed to fetch about data' }, { status: 500 })
  }
}

// POST /api/about - Update about data
export async function POST(request: NextRequest) {
  try {
    const aboutData = await request.json()
    await saveAboutData(aboutData)
    return NextResponse.json(aboutData)
  } catch (error) {
    console.error('Save about data error:', error)
    return NextResponse.json({ error: 'Failed to save about data' }, { status: 500 })
  }
}