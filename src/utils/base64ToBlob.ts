export const base64ToBlob = (base64: string) => {
  try {
    const byteString = atob(base64.split(",")[1]); // Decode base64
    const mimeString = base64.split(",")[0].split(":")[1].split(";")[0]; // Extract MIME type
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  } catch (error) {
    console.error("Failed to convert base64 to Blob:", error);
    return null;
  }
};
