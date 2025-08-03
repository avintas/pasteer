This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Image Handling for Vercel Deployment

This application is optimized for Vercel deployment with proper image handling:

### Local Images
- Place images in the `public/` directory
- Reference them with leading slash: `/image-name.jpg`
- Use the `next/image` component for optimization
- Images are automatically optimized and served via CDN

### Image Configuration
- Next.js image optimization is enabled
- Supports WebP and AVIF formats for better performance
- Responsive image sizes configured for different devices
- Vercel Blob storage integration ready for external images

### Best Practices
- Use the `getOptimizedImageProps()` utility function for consistent image handling
- Always provide `alt` text for accessibility
- Set appropriate `width` and `height` for layout stability
- Use `priority` for above-the-fold images

## Blob Storage Setup

This application uses Vercel Blob for storing processed content. To enable this feature:

1. **Get your BLOB_READ_WRITE_TOKEN** from the [Vercel Dashboard](https://vercel.com/dashboard)
2. **Create a `.env.local` file** in your project root:
   ```bash
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your_token_here
   ```
3. **Restart your development server**

For detailed setup instructions, see [BLOB_TOKEN_SETUP.md](./BLOB_TOKEN_SETUP.md).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
