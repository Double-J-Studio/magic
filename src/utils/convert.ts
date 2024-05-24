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

export function convertToUpper(text: string, char1 = "", char2 = "") {
  const escapeRegExp = (char?: string) =>
    char?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  if (!char1 && !char2) {
    return text;
  }

  const regexParts = [];
  if (char1) regexParts.push(escapeRegExp(char1));
  if (char2) regexParts.push(escapeRegExp(char2));
  const regex = new RegExp(regexParts.join("|"), "g");

  return text.replace(regex, (match) => match.toUpperCase());
}

export function removePatterns(text: string, char1 = "", char2 = "") {
  const escapeRegExp = (char?: string) =>
    char?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  if (!char1 && !char2) {
    return text?.split("-")[0];
  }

  const regexParts = [];
  if (char1) regexParts.push(escapeRegExp(char1));
  if (char2) regexParts.push(escapeRegExp(char2));
  const regex = new RegExp(regexParts.join("|"), "g");

  return text.replace(regex, "").trim();
}
