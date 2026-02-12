import type { IRumiOptions } from "./types";
import { convertToWebP } from "./webp-converter";

export async function uploadFile(
  file: File,
  options: IRumiOptions,
): Promise<string> {
  if (file.size > options.maxSize) {
    throw new Error(
      `File size ${file.size} exceeds maximum ${options.maxSize} bytes`,
    );
  }

  // TODO: Implement actual Rumi server upload
  // POST ${options.server}/upload with Authorization: Bearer ${options.token}
  // Returns: uploaded file URL
  throw new Error("Rumi upload not implemented yet");
}

export async function uploadImage(
  file: File,
  options: IRumiOptions,
): Promise<string> {
  const webpBlob = await convertToWebP(file);
  const webpFile = new File([webpBlob], file.name.replace(/\.[^.]+$/, ".webp"), {
    type: "image/webp",
  });
  return uploadFile(webpFile, options);
}
