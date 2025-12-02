import { getClient } from "./Client.js";
import { RateLimitError } from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

const Pick = z.object({
  card_id: z.number().int(),
  reasoning: z.string().describe("One or two paragraphs explaining the pick")
})

const Analysis = z.object({
  summary: z.string(),
  analysis_ready: z.boolean().describe("Are you done with analysis now?")
})

export const callLLM = async (input, mode, maxAttempts = 5) => {
  const client = getClient();
  let attempt = 0;
  let format = ""

  switch (mode) {
    case "pick":
      format = zodTextFormat(Pick, "pick")
      break;
    case "analyze":
      format = zodTextFormat(Analysis, "analysis")
      break;
    default:
      throw new Error(`Unknown mode for LLM call: ${mode}`);
  }

  while (attempt < maxAttempts) {
    try {
      const res = await client.responses.parse({
        model: process.env.MODEL,
        input: input,
        text: {
          format: format
        }
      });

      return res.output_parsed;

    } catch (error) {
      if (error instanceof RateLimitError) {
        attempt++;
        
        // Parse wait time from error message
        const match = error.message.match(/(\d+) second/i);
        const waitTime = match ? parseInt(match[1]) : 60;
        
        console.log(`Rate limited. Attempt ${attempt}/${maxAttempts}. Waiting ${waitTime}s...`);
        
        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
        }
      } else {
        throw error; // Re-throw non-rate-limit errors
      }
    }
  }

  throw new Error(`Failed after ${maxAttempts} attempts due to rate limiting`);
};