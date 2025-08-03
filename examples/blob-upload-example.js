/**
 * Example: Using the Correct BLOB_READ_WRITE_TOKEN
 * 
 * This example demonstrates how to properly use the BLOB_READ_WRITE_TOKEN
 * with the Vercel Blob SDK.
 */

import { put } from '@vercel/blob'
import fs from 'fs'
import path from 'path'

// Example 1: Using environment variable (recommended)
async function uploadWithEnvToken() {
  try {
    console.log('📤 Uploading with environment token...')
    
    // The SDK automatically uses BLOB_READ_WRITE_TOKEN from environment
    const blob = await put('example.txt', 'Hello from PASTEER!', {
      access: 'public',
    })
    
    console.log('✅ Upload successful!')
    console.log('📎 URL:', blob.url)
    console.log('📁 Pathname:', blob.pathname)
    
    return blob
  } catch (error) {
    console.error('❌ Upload failed:', error.message)
    
    if (error.message.includes('token')) {
      console.log('💡 Make sure BLOB_READ_WRITE_TOKEN is set in your environment')
      console.log('💡 Run: export BLOB_READ_WRITE_TOKEN=your_token_here')
    }
    
    throw error
  }
}

// Example 2: Using explicit token (alternative approach)
async function uploadWithExplicitToken(token) {
  try {
    console.log('📤 Uploading with explicit token...')
    
    const blob = await put('example-explicit.txt', 'Hello from PASTEER with explicit token!', {
      access: 'public',
      token: token, // Explicitly pass the token
    })
    
    console.log('✅ Upload successful!')
    console.log('📎 URL:', blob.url)
    
    return blob
  } catch (error) {
    console.error('❌ Upload failed:', error.message)
    throw error
  }
}

// Example 3: Upload file from filesystem
async function uploadFile(filePath) {
  try {
    console.log(`📤 Uploading file: ${filePath}`)
    
    const content = fs.readFileSync(filePath, 'utf8')
    const filename = path.basename(filePath)
    
    const blob = await put(filename, content, {
      access: 'public',
    })
    
    console.log('✅ File upload successful!')
    console.log('📎 URL:', blob.url)
    
    return blob
  } catch (error) {
    console.error('❌ File upload failed:', error.message)
    throw error
  }
}

// Example 4: CLI equivalent commands
function showCLIExamples() {
  console.log('\n🔧 CLI Examples:')
  console.log('')
  console.log('1. Upload with environment token:')
  console.log('   export BLOB_READ_WRITE_TOKEN=your_token_here')
  console.log('   vercel blob put image.jpg')
  console.log('')
  console.log('2. Upload with explicit token:')
  console.log('   vercel blob put image.jpg --rw-token [BLOB_READ_WRITE_TOKEN]')
  console.log('')
  console.log('3. List blobs:')
  console.log('   vercel blob list --rw-token [BLOB_READ_WRITE_TOKEN]')
  console.log('')
  console.log('4. Delete blob:')
  console.log('   vercel blob del [BLOB_ID] --rw-token [BLOB_READ_WRITE_TOKEN]')
}

// Example 5: Token validation
function validateToken(token) {
  if (!token) {
    console.error('❌ No token provided')
    return false
  }
  
  if (token.length < 10) {
    console.error('❌ Token appears to be too short')
    return false
  }
  
  if (!token.startsWith('vercel_blob_rw_')) {
    console.error('❌ Token format appears incorrect (should start with "vercel_blob_rw_")')
    return false
  }
  
  console.log('✅ Token format looks valid')
  return true
}

// Main execution
async function main() {
  console.log('🚀 PASTEER Blob Upload Examples')
  console.log('================================')
  
  // Check if token is available
  const token = process.env.BLOB_READ_WRITE_TOKEN
  
  if (!token) {
    console.error('❌ BLOB_READ_WRITE_TOKEN not found in environment')
    console.log('💡 Set it with: export BLOB_READ_WRITE_TOKEN=your_token_here')
    console.log('💡 Or add it to your .env.local file')
    return
  }
  
  // Validate token format
  if (!validateToken(token)) {
    return
  }
  
  try {
    // Example 1: Upload with environment token
    await uploadWithEnvToken()
    
    console.log('\n' + '='.repeat(50) + '\n')
    
    // Example 2: Upload with explicit token
    await uploadWithExplicitToken(token)
    
    console.log('\n' + '='.repeat(50) + '\n')
    
    // Show CLI examples
    showCLIExamples()
    
  } catch (error) {
    console.error('❌ Example execution failed:', error.message)
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}

export {
  uploadWithEnvToken,
  uploadWithExplicitToken,
  uploadFile,
  validateToken,
  showCLIExamples
} 