/**
 * Client-side image resizing for profile photos. Pure, no React.
 *
 * Reads a File, draws it onto a <canvas> preserving aspect ratio (optionally
 * center-cropping to a square), and exports a compact WebP/JPEG data URL. This
 * keeps avatars uniform and stops megabyte-sized base64 from bloating the store.
 */

export interface ResizeOptions {
  maxW: number;
  maxH: number;
  /** Center-crop to a square before scaling (для аватара). */
  square?: boolean;
  /** 0..1 lossy quality. Default ~0.85. */
  quality?: number;
}

export async function fileToResizedDataUrl(file: File, opts: ResizeOptions): Promise<string> {
  const { maxW, maxH, square = false, quality = 0.85 } = opts;

  if (!file.type.startsWith('image/')) {
    throw new Error('Это не изображение — выбери картинку.');
  }

  const img = await loadImage(file);
  const sw = img.naturalWidth;
  const sh = img.naturalHeight;
  if (!sw || !sh) {
    throw new Error('Не удалось прочитать изображение.');
  }

  // Source crop rectangle — full image, or a centered square.
  let sx = 0;
  let sy = 0;
  let cw = sw;
  let ch = sh;
  if (square) {
    const side = Math.min(sw, sh);
    sx = Math.round((sw - side) / 2);
    sy = Math.round((sh - side) / 2);
    cw = side;
    ch = side;
  }

  // Fit the crop into the max box, never upscaling.
  const ratio = Math.min(maxW / cw, maxH / ch, 1);
  const tw = Math.max(1, Math.round(cw * ratio));
  const th = Math.max(1, Math.round(ch * ratio));

  const canvas = document.createElement('canvas');
  canvas.width = tw;
  canvas.height = th;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Холст недоступен в этом браузере.');
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, sx, sy, cw, ch, 0, 0, tw, th);

  // Prefer WebP; fall back to JPEG where the encoder isn't available.
  const webp = canvas.toDataURL('image/webp', quality);
  if (webp.startsWith('data:image/webp')) return webp;
  return canvas.toDataURL('image/jpeg', quality);
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Битый файл или неподдерживаемый формат.'));
    };
    img.src = url;
  });
}
