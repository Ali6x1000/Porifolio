import { NextRequest, NextResponse } from 'next/server'
import { put, list } from '@vercel/blob'

export async function GET() {
  try {
    const { blobs } = await list({
      prefix: 'about/',
      limit: 1
    })

    if (blobs.length === 0) {
      // Return default data if no about data exists
      const defaultData = {
        profileImage: '/placeholder-avatar.jpg',
        name: 'Ali Nawaf',
        title: 'Computer Science Student & Developer',
        location: 'Cleveland, OH',
        email: 'aan90@case.edu',
        phone: '+1 (216) 647-4302',
        bio: {
          introduction: "Hello! I'm Ali, a passionate Computer Science student with a love for creating innovative solutions and building impactful software applications.",
          background: "Currently pursuing my degree in Computer Science, I've developed a strong foundation in programming, algorithms, and software engineering principles. My journey in tech started with curiosity and has evolved into a genuine passion for problem-solving.",
          interests: "When I'm not coding, I enjoy exploring new technologies, contributing to open-source projects, and staying up-to-date with the latest trends in web development and artificial intelligence.",
          goals: "My goal is to leverage technology to create meaningful solutions that make a positive impact on people's lives. I'm always eager to learn new skills and take on challenging projects."
        },
        stats: [
          { label: 'Projects Completed', value: '20+' },
          { label: 'Technologies Used', value: '15+' },
          { label: 'Years of Experience', value: '3+' },
          { label: 'Coffee Cups', value: '∞' }
        ],
        personalFacts: [
          'I started programming when I was 16',
          'I love solving algorithmic challenges',
          'I enjoy mentoring fellow students',
          'I speak three languages fluently'
        ]
      }
      return NextResponse.json(defaultData)
    }

    const aboutBlob = blobs[0]
    const response = await fetch(aboutBlob.url)
    const aboutData = await response.json()

    return NextResponse.json(aboutData)
  } catch (error) {
    console.error('Error fetching about data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch about data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const aboutData = await request.json()

    const blob = await put(
      'about/data.json',
      JSON.stringify(aboutData, null, 2),
      {
        access: 'public',
        contentType: 'application/json',
      }
    )

    return NextResponse.json({ 
      message: 'About data updated successfully',
      url: blob.url 
    })
  } catch (error) {
    console.error('Error updating about data:', error)
    return NextResponse.json(
      { error: 'Failed to update about data' },
      { status: 500 }
    )
  }
}
