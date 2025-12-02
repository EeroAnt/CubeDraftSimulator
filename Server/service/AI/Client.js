import { AzureOpenAI } from "openai";

export function getClient() {
  return new AzureOpenAI({
    endpoint: process.env.AZURE_API_ENDPOINT,
    apiKey: process.env.AZURE_API_KEY,
    apiVersion: "2025-03-01-preview"
  });;
}