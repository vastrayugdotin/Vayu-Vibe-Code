// ─────────────────────────────────────────────────────────────
// Vastrayug — Hostinger Object Storage (S3-compatible)
// Reference: tech_stack.md §9
//
// File key conventions:
//   products/{productId}/{uuid}.webp
//   blog/{postId}/{uuid}.webp
//   brand/logo.png
//
// Usage:
//   import { uploadFile, deleteFile } from '@/lib/storage'
//
//   const url = await uploadFile('products/abc123/img.webp', buffer, 'image/webp')
//   await deleteFile('products/abc123/img.webp')
// ─────────────────────────────────────────────────────────────

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'

const s3 = new S3Client({
  endpoint: process.env.STORAGE_ENDPOINT!,
  region: 'auto',
  credentials: {
    accessKeyId: process.env.STORAGE_ACCESS_KEY!,
    secretAccessKey: process.env.STORAGE_SECRET_KEY!,
  },
  forcePathStyle: true,
})

const BUCKET = process.env.STORAGE_BUCKET_NAME!

/**
 * Upload a file to Hostinger Object Storage.
 *
 * @param key         - Object key (path) e.g. `products/{id}/{uuid}.webp`.
 * @param buffer      - File contents as a Buffer.
 * @param contentType - MIME type e.g. `image/webp`, `image/jpeg`.
 * @returns The public URL of the uploaded object.
 */
export async function uploadFile(
  key: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ACL: 'public-read',
      CacheControl: 'max-age=31536000',
    })
  )

  return `${process.env.STORAGE_PUBLIC_URL}/${key}`
}

/**
 * Delete a file from Hostinger Object Storage.
 *
 * @param key - Object key (path) to delete.
 */
export async function deleteFile(key: string): Promise<void> {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  )
}
