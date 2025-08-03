# Unified Image Handling Setup

This setup allows your app to use the same image references for both local development and Vercel deployment.

## How It Works

- **Local Development**: Uses images from `/public/` directory
- **Vercel Production**: Uses images from Vercel Blob storage
- **Same Code**: No environment-specific logic in components
- **Caching Support**: Handles Vercel Blob caching with cache busters

## Environment Variables

### Local Development (.env.local)
```bash
# Your existing blob token for uploads
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your_token_here

# Optional: If you want to test blob URLs locally
NEXT_PUBLIC_BLOB_STORE_URL=https://your-store-id.public.blob.vercel-storage.com
```

### Vercel Production (Vercel Dashboard)
1. Go to your Vercel project settings
2. Add these environment variables:

```bash
# For blob uploads
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your_token_here

# For blob image URLs (public)
NEXT_PUBLIC_BLOB_STORE_URL=https://your-store-id.public.blob.vercel-storage.com
```

## How to Get Your Blob Store URL

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to Storage → Blob
3. Find your store ID in the URL or settings
4. Your blob store URL format: `https://{store-id}.public.blob.vercel-storage.com`

## Usage in Components

### Basic Usage
```typescript
import { getUnifiedImageUrl } from "@/lib/utils"

// This works in both environments
<Image 
  src={getUnifiedImageUrl("ai_cartoon_face.jpg")}
  alt="Logo"
  width={40}
  height={40}
/>
```

### With Cache Buster (for updated images)
```typescript
import { getUnifiedImageUrl } from "@/lib/utils"

// Add cache buster to force browser to fetch updated image
<Image 
  src={getUnifiedImageUrl("ai_cartoon_face.jpg", { 
    cacheBuster: Date.now().toString() 
  })}
  alt="Logo"
  width={40}
  height={40}
/>
```

### Download URL (forces download)
```typescript
import { getBlobDownloadUrl } from "@/lib/utils"

// For files that should be downloaded instead of displayed
<a href={getBlobDownloadUrl("document.pdf")}>
  Download PDF
</a>
```

## Vercel Blob Caching

- **Browser Cache**: Up to 1 month by default
- **Vercel Cache**: Up to 1 month by default
- **Cache Size**: Up to 512 MB per blob
- **Cache Buster**: Add `?v=timestamp` to force refresh

## Best Practices

### Treat Blobs as Immutable
- ✅ **Create new blobs** instead of overwriting existing ones
- ✅ **Use unique pathnames** with timestamps or UUIDs
- ✅ **Use `addRandomSuffix: true`** when uploading

### Caching Strategy
- ✅ **Add cache busters** for frequently updated images
- ✅ **Use timestamps** in filenames for versioning
- ✅ **Consider cache duration** for your use case

### Performance
- ✅ **Use Next.js Image component** for optimization
- ✅ **Set appropriate width/height** for layout stability
- ✅ **Use `priority`** for above-the-fold images

## Benefits

- ✅ **Unified codebase** - Same code for dev and production
- ✅ **IDE friendly** - Can still reference local files
- ✅ **Easy maintenance** - One source of truth
- ✅ **Automatic switching** - Based on environment
- ✅ **Caching support** - Handles Vercel Blob caching
- ✅ **Download support** - For files that should be downloaded 