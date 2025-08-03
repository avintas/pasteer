#!/usr/bin/env node

/**
 * Verify Blob Image Accessibility
 * 
 * This script checks if the AI cartoon face image is accessible
 * from the Vercel blob storage URL.
 */

import fetch from 'node-fetch'

const BLOB_IMAGE_URL = 'https://nqezafsao1noacy7.public.blob.vercel-storage.com/ai_cartoon_face.jpg'

async function verifyBlobImage() {
  console.log('🔍 Verifying Blob Image Accessibility')
  console.log('=====================================')
  console.log('📎 Image URL:', BLOB_IMAGE_URL)
  
  try {
    console.log('\n📡 Testing image accessibility...')
    const response = await fetch(BLOB_IMAGE_URL, { method: 'HEAD' })
    
    console.log('📊 Response Status:', response.status)
    console.log('📊 Response Status Text:', response.statusText)
    
    if (response.ok) {
      console.log('✅ Image is accessible!')
      
      // Get content type
      const contentType = response.headers.get('content-type')
      console.log('📄 Content Type:', contentType)
      
      // Get content length
      const contentLength = response.headers.get('content-length')
      if (contentLength) {
        console.log('📏 File Size:', (parseInt(contentLength) / 1024).toFixed(2), 'KB')
      }
      
      // Check cache headers
      const cacheControl = response.headers.get('cache-control')
      console.log('⏰ Cache Control:', cacheControl)
      
      return true
    } else {
      console.error('❌ Image is not accessible')
      console.log('💡 Status code indicates an issue with the image')
      return false
    }
  } catch (error) {
    console.error('❌ Network error:', error.message)
    return false
  }
}

async function main() {
  try {
    const success = await verifyBlobImage()
    
    console.log('\n' + '='.repeat(50))
    
    if (success) {
      console.log('🎉 Blob image verification successful!')
      console.log('💡 The image should load properly in your app.')
    } else {
      console.log('❌ Blob image verification failed.')
      console.log('💡 Check the blob storage configuration.')
    }
    
    console.log('='.repeat(50))
  } catch (error) {
    console.error('❌ Verification script failed:', error.message)
    process.exit(1)
  }
}

// Run the verification
main() 