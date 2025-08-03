#!/usr/bin/env node

/**
 * Upload Image to Vercel Blob Storage
 * 
 * This script uploads the AI cartoon face image to Vercel blob storage
 * so it can be served from the blob URL in production.
 */

import { put } from '@vercel/blob'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

async function uploadImage() {
  console.log('📤 Uploading AI Cartoon Face Image to Vercel Blob')
  console.log('================================================')
  
  const token = process.env.BLOB_READ_WRITE_TOKEN
  
  // Check if token exists
  if (!token) {
    console.error('❌ BLOB_READ_WRITE_TOKEN not found')
    console.log('💡 Add it to your .env.local file:')
    console.log('   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your_token_here')
    return false
  }
  
  // Check if image file exists
  const imagePath = path.join(process.cwd(), 'public', 'ai_cartoon_face.jpg')
  if (!fs.existsSync(imagePath)) {
    console.error('❌ Image file not found:', imagePath)
    return false
  }
  
  try {
    // Read the image file
    const imageBuffer = fs.readFileSync(imagePath)
    
    console.log('📁 Reading image file...')
    console.log('📏 File size:', (imageBuffer.length / 1024).toFixed(2), 'KB')
    
    // Upload to blob storage
    console.log('☁️ Uploading to Vercel Blob...')
    const blob = await put('ai_cartoon_face.jpg', imageBuffer, {
      access: 'public',
      addRandomSuffix: false, // Keep the same filename
    })
    
    console.log('✅ Upload successful!')
    console.log('📎 Blob URL:', blob.url)
    console.log('📁 Pathname:', blob.pathname)
    
    // Show the environment variable to set
    const blobStoreUrl = blob.url.replace('/ai_cartoon_face.jpg', '')
    console.log('\n💡 Add this to your environment variables:')
    console.log(`NEXT_PUBLIC_BLOB_STORE_URL=${blobStoreUrl}`)
    
    return true
  } catch (error) {
    console.error('❌ Upload failed:', error.message)
    
    if (error.message.includes('token') || error.message.includes('unauthorized')) {
      console.log('💡 Token appears to be invalid or expired')
      console.log('💡 Generate a new token from Vercel Dashboard')
    } else if (error.message.includes('network')) {
      console.log('💡 Network error - check your internet connection')
    } else {
      console.log('💡 Unknown error - check the error message above')
    }
    
    return false
  }
}

async function main() {
  try {
    const success = await uploadImage()
    
    console.log('\n' + '='.repeat(50))
    
    if (success) {
      console.log('🎉 Image uploaded successfully!')
      console.log('💡 You can now use the blob URL in production.')
      console.log('💡 Don\'t forget to set the NEXT_PUBLIC_BLOB_STORE_URL environment variable.')
    } else {
      console.log('❌ Upload failed. Please fix the issues above.')
    }
    
    console.log('='.repeat(50))
  } catch (error) {
    console.error('❌ Upload script failed:', error.message)
    process.exit(1)
  }
}

// Run the upload
main() 