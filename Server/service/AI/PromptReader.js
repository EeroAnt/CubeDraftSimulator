import { readFileSync } from "fs";

export const loadPrompt = (filename) => {
  return readFileSync(`./service/AI/prompts/${filename}`, "utf-8");
};