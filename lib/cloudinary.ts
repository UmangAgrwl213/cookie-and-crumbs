import { clientEnv } from "@/lib/env.client";

const cloudName = clientEnv.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "cookie-and-crumbs";

export function cloudinaryLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  const params = ['f_auto', `q_${quality ?? 'auto'}`, `w_${width}`, 'c_limit'];
  return `https://res.cloudinary.com/${cloudName}/image/upload/${params.join(',')}/${src}`;
}

export function getImageUrl(publicId: string, options: { width?: number; height?: number; crop?: string; quality?: string } = {}) {
  const { width, height, crop = 'fill', quality = 'auto' } = options;
  const params = ['f_auto', `q_${quality}`];
  if (width) params.push(`w_${width}`);
  if (height) params.push(`h_${height}`);
  params.push(`c_${crop}`);
  if (crop === 'fill') params.push('g_auto');
  return `https://res.cloudinary.com/${cloudName}/image/upload/${params.join(',')}/${publicId}`;
}

export function getBlurDataUrl(publicId: string): string {
  return `https://res.cloudinary.com/${cloudName}/image/upload/e_blur:1000,q_1,w_20/${publicId}`;
}
