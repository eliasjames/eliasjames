import type { PutBlobResult } from "@vercel/blob";

export default async function uploadToBlobStorage(
  file: File | null,
  filename: string
): Promise<PutBlobResult | null> {
  const writeToken = process.env.VERCEL_BLOB_WRITE_TOKEN;

  const response = await fetch(`/api/images/upload?filename=${filename}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${writeToken}`,
      "Content-Type": "application/octet-stream",
    },
    body: file,
  });

  const newBlob = (await response.json()) as PutBlobResult;

  return newBlob;
}
