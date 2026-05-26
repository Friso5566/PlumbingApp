import { storagePut } from "./storage";

export async function uploadImageToStorage(
  userId: number,
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> {
  const fileKey = `plumbing-images/${userId}/${Date.now()}-${fileName}`;
  
  const { url } = await storagePut(
    fileKey,
    fileBuffer,
    mimeType
  );

  return url;
}
