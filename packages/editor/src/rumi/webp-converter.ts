export async function convertToWebP(
  file: File,
  quality = 0.85,
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get canvas 2d context");
  }
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  const blob = await canvas.convertToBlob({ type: "image/webp", quality });
  return blob;
}
