export function safeParseJSON(s: string) {
  try {
    return JSON.parse(s || "{}");
  } catch (error) {
    console.error("error", error);
    return {};
  }
}
