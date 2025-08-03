#!/usr/bin/env node

/**
 * Test Script: Verify BLOB_READ_WRITE_TOKEN Configuration
 * 
 * This script tests if your BLOB_READ_WRITE_TOKEN is properly configured
 * and can be used with the Vercel Blob SDK.
 */

import { put } from '@vercel/blob'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

async function testBlobToken() {
  console.log('🔍 Testing BLOB_READ_WRITE_TOKEN Configuration')
  console.log('==============================================')
  
  const token = process.env.BLOB_READ_WRITE_TOKEN
  
  // Check 1: Token exists
  console.log('\n1️⃣ Checking if token exists...')
  if (!token) {
    console.error('❌ BLOB_READ_WRITE_TOKEN not found')
    console.log('💡 Add it to your .env.local file:')
    console.log('   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your_token_here')
    return false
  }
  console.log('✅ Token found')
  
  // Check 2: Token format
  console.log('\n2️⃣ Checking token format...')
  if (token.length < 10) {
    console.error('❌ Token appears to be too short')
    return false
  }
  
  if (!token.startsWith('vercel_blob_rw_')) {
    console.error('❌ Token format appears incorrect')
    console.log('💡 Token should start with "vercel_blob_rw_"')
    return false
  }
  console.log('✅ Token format looks valid')
  
  // Check 3: Test upload
  console.log('\n3️⃣ Testing upload functionality...')
  try {
    const testContent = `PASTEER Test Upload
Generated: ${new Date().toISOString()}
Token: ${token.substring(0, 20)}...`
    
    const blob = await put(`test-${Date.now()}.txt`, testContent, {
      access: 'public',
    })
    
    console.log('✅ Upload successful!')
    console.log('📎 URL:', blob.url)
    console.log('📁 Pathname:', blob.pathname)
    
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
    const success = await testBlobToken()
    
    console.log('\n' + '='.repeat(50))
    
    if (success) {
      console.log('🎉 All tests passed! Your BLOB_READ_WRITE_TOKEN is working correctly.')
      console.log('💡 You can now use the blob storage feature in PASTEER.')
    } else {
      console.log('❌ Tests failed. Please fix the issues above before using blob storage.')
      console.log('📖 See BLOB_TOKEN_SETUP.md for detailed setup instructions.')
    }
    
    console.log('='.repeat(50))
  } catch (error) {
    console.error('❌ Test script failed:', error.message)
    process.exit(1)
  }
}

// Run the test
main() 