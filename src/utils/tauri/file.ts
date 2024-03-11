import { BaseDirectory, readBinaryFile, readDir } from "@tauri-apps/api/fs";

/**
 * @example readImage(
      '/Users/jj/Library/Application Support/app.doublejstudio.magic/images/img-2024-02-25_15-04-37.png'
    ).then((data) => {
      const blob = new Blob([data]);
      setImageUrl(URL.createObjectURL(blob));
    });
 * @param filename 
 * @returns 
 */
export async function readImage(filename: string) {
  return await readBinaryFile(filename);
}

export async function readImages() {
  return await readDir("images", {
    dir: BaseDirectory.AppLocalData,
    recursive: true,
  });
}
