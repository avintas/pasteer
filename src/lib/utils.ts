import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Unified image URL function for both local and Vercel environments
export function getUnifiedImageUrl(filename: string, options?: {
  forceDownload?: boolean;
  cacheBuster?: string;
}): string {
  // Check if we're in production (Vercel) or development
  const isProduction = process.env.NODE_ENV === 'production'
  
  if (isProduction) {
    // On Vercel, use blob storage URL
    const blobStoreUrl = process.env.NEXT_PUBLIC_BLOB_STORE_URL
    if (blobStoreUrl) {
      // Ensure clean filename (remove leading slash if present)
      const cleanFilename = filename.startsWith('/') ? filename.substring(1) : filename
      
      // Build the base URL
      let url = `${blobStoreUrl}/${cleanFilename}`
      
      // Add cache buster if provided (helps with browser caching issues)
      if (options?.cacheBuster) {
        url += `?v=${options.cacheBuster}`
      }
      
      return url
    }
  }
  
  // In development or if no blob URL configured, use local public directory
  let url = `/${filename}`
  
  // Add cache buster for local development too if provided
  if (options?.cacheBuster) {
    url += `?v=${options.cacheBuster}`
  }
  
  return url
}

// Helper function to get download URL for blobs (forces download)
export function getBlobDownloadUrl(filename: string): string {
  const isProduction = process.env.NODE_ENV === 'production'
  
  if (isProduction) {
    const blobStoreUrl = process.env.NEXT_PUBLIC_BLOB_STORE_URL
    if (blobStoreUrl) {
      const cleanFilename = filename.startsWith('/') ? filename.substring(1) : filename
      return `${blobStoreUrl}/${cleanFilename}?download=true`
    }
  }
  
  // For local development, just return the regular URL
  return `/${filename}`
}
