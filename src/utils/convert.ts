export async function blobToBase64(blobUrl: string) {
  const response = await fetch(blobUrl);
  const blob = await response.blob();

  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
  });
}
