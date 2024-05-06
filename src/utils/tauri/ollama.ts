import { invoke } from "@tauri-apps/api/tauri";

export async function getOllamaVersion() {
  return await invoke("get_ollama_version");
}

export async function getOllamaModels() {
  return await invoke("get_ollama_models");
}
