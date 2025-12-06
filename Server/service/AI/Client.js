import { AzureOpenAI } from "openai";
import { nextClientIndex, clientIndex } from "../State.js";


export function getClient() {
  const CLIENTS = [
    {
      endpoint: process.env.ENDPOINT_FRANCE,
      apiKey: process.env.KEY_FRANCE
    },
    {
      endpoint: process.env.ENDPOINT_GERMANY,
      apiKey: process.env.KEY_GERMANY
    },
    {
      endpoint: process.env.ENDPOINT_ITALY,
      apiKey: process.env.KEY_ITALY
    },
    {
      endpoint: process.env.ENDPOINT_POLAND,
      apiKey: process.env.KEY_POLAND
    },
    {
      endpoint: process.env.ENDPOINT_SWEDEN,
      apiKey: process.env.KEY_SWEDEN
    },
  ]
  const cfg = CLIENTS[clientIndex];

  // move to next for next call
  nextClientIndex(CLIENTS.length);

  return new AzureOpenAI({
    endpoint: cfg.endpoint,
    apiKey: cfg.apiKey,
    apiVersion: "2025-03-01-preview",
  });
}