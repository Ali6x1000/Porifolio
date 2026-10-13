import { NextRequest, NextResponse } from 'next/server'
import { put, list } from '@vercel/blob'
import { revalidatePath, revalidateTag } from 'next/cache'
import { ABOUT_BLOB_KEY, ABOUT_CACHE_TAG, DEFAULT_ABOUT, getAboutData, type AboutData } from '../../../lib/about'

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
      return NextResponse.json(DEFAULT_ABOUT)
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
    revalidateTag(ABOUT_CACHE_TAG)
    revalidatePath('/about')
    return NextResponse.json(aboutData)
  } catch (error) {
    console.error('Save about data error:', error)
    return NextResponse.json({ error: 'Failed to save about data' }, { status: 500 })
  }
}