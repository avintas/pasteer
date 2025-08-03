import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to get the correct image URL for Vercel deployment
export function getImageUrl(path: string): string {
  // For local images in public directory
  if (path.startsWith('/')) {
    return path
  }
  
  // For external images, you can add domain validation here
  return path
}

// Utility function to validate image paths
export function isValidImagePath(path: string): boolean {
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.avif']
  const extension = path.toLowerCase().substring(path.lastIndexOf('.'))
  return validExtensions.includes(extension)
}

// Utility function to get optimized image props for Next.js Image component
export function getOptimizedImageProps(
  src: string,
  alt: string,
  width: number,
  height: number,
  className?: string
) {
  return {
    src: getImageUrl(src),
    alt,
    width,
    height,
    className,
    priority: true, // Load important images first
  }
}
