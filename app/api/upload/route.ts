// in app/api/upload/route.ts
import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  // The filename is passed as a query parameter
  const filename = searchParams.get('filename');

  if (!filename || !request.body) {
    return NextResponse.json({ error: 'No filename or file body provided' }, { status: 400 });
  }

  try {
    // Upload the file to Vercel Blob
    const blob = await put(filename, request.body, {
      access: 'public', // Make the file publicly accessible
    });

    // The 'blob' object contains the final URL
    return NextResponse.json(blob);
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}