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
        { 
          error: 'Blob storage not configured. Please set BLOB_READ_WRITE_TOKEN environment variable.',
          instructions: [
            '1. Get your BLOB_READ_WRITE_TOKEN from Vercel Dashboard',
            '2. Add it to your .env.local file: BLOB_READ_WRITE_TOKEN=your_token_here',
            '3. For production, add it to your Vercel project environment variables',
            '4. Restart your development server after adding the token'
          ]
        },
        { status: 500 }
      )
    }

    // Validate token format (basic check)
    if (process.env.BLOB_READ_WRITE_TOKEN.length < 10) {
      console.error('BLOB_READ_WRITE_TOKEN appears to be invalid (too short)')
      return NextResponse.json(
        { 
          error: 'Invalid BLOB_READ_WRITE_TOKEN format. Please check your token.',
          instructions: [
            '1. Ensure your token is the correct BLOB_READ_WRITE_TOKEN from Vercel',
            '2. Token should be a long string starting with "vercel_blob_rw_"',
            '3. Get a fresh token from your Vercel project settings if needed'
          ]
        },
        { status: 500 }
      )
    }

    // Upload to Vercel Blob with explicit token usage
    const blob = await put(filename, content, {
      access: 'public',
      // The SDK automatically uses BLOB_READ_WRITE_TOKEN from environment
      // but we can also pass it explicitly if needed:
      // token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    return NextResponse.json({
      success: true,
      url: blob.url,
      pathname: blob.pathname,
      message: 'Content uploaded successfully to Vercel Blob'
    })
  } catch (error) {
    console.error('Blob upload error:', error)
    
    // Provide more specific error messages based on error type
    let errorMessage = 'Failed to upload to blob storage'
    let instructions: string[] = []
    
    if (error instanceof Error) {
      if (error.message.includes('token') || error.message.includes('unauthorized')) {
        errorMessage = 'Invalid or expired blob token'
        instructions = [
          '1. Check that your BLOB_READ_WRITE_TOKEN is correct',
          '2. Ensure the token is from the correct Vercel project',
          '3. Generate a new token from Vercel Dashboard if needed',
          '4. For CLI usage: vercel blob put image.jpg --rw-token [BLOB_READ_WRITE_TOKEN]'
        ]
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = 'Network error connecting to Vercel Blob'
        instructions = [
          '1. Check your internet connection',
          '2. Verify Vercel services are available',
          '3. Try again in a few moments'
        ]
      } else if (error.message.includes('quota') || error.message.includes('limit')) {
        errorMessage = 'Blob storage quota exceeded'
        instructions = [
          '1. Check your Vercel Blob usage limits',
          '2. Consider upgrading your Vercel plan',
          '3. Delete old blobs to free up space'
        ]
      } else {
        errorMessage = error.message
        instructions = [
          '1. Check the error details above',
          '2. Ensure your content is valid',
          '3. Try with a smaller file if applicable'
        ]
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        instructions,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 