import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { content, filename } = await request.json()
    
    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    // Check if Blob token is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('BLOB_READ_WRITE_TOKEN environment variable is not set')
      return NextResponse.json(
        { error: 'Blob storage not configured. Please set BLOB_READ_WRITE_TOKEN environment variable.' },
        { status: 500 }
      )
    }

    // Upload to Vercel Blob
    const blob = await put(filename, content, {
      access: 'public',
    })

    return NextResponse.json({
      success: true,
      url: blob.url,
      pathname: blob.pathname,
    })
  } catch (error) {
    console.error('Blob upload error:', error)
    
    // Provide more specific error messages
    let errorMessage = 'Failed to upload to blob storage'
    if (error instanceof Error) {
      if (error.message.includes('token')) {
        errorMessage = 'Invalid blob token. Please check your BLOB_READ_WRITE_TOKEN'
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your internet connection'
      } else {
        errorMessage = error.message
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
} 