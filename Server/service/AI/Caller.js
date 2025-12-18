import { getClient } from "./Client.js";
import { RateLimitError } from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { parseWriteUpDataFromSeat } from "../Utils.js";
import { loadPrompt } from "./PromptReader.js";
import fs from 'fs';


const Pick = z.object({
  card_id: z.number().int(),
  reasoning: z.string().describe("One or two paragraphs explaining the pick"),
  tags: z.array(z.string().describe("max 30 chars each")).nullable()
})

const ToolCall = z.object({
  tool: z.enum(["tag_cards", "add_game_plan", "update_game_plan", "remove_game_plan", "remove_tags_from_cards"]),
  card_ids: z.array(z.number().int()).nullable(),
  tag: z.string().nullable().describe("Tag to apply, max 30 characters"),
  commander_ids: z.array(z.number().int()).nullable(),
  relevant_tags: z.array(z.string()).nullable().describe("Array of tags, each max 30 chars"),
  game_plan: z.string().nullable(),
  game_plan_key: z.string().nullable().describe("Key of existing game plan (commander name(s) joined with ' + ')")
});

const Analysis = z.object({
  summary: z.string().describe("Strategic summary for the picker - only needed when analysis_ready is true").nullable(),
  analysis_ready: z.boolean().describe("Set true when done analyzing, false if making tool calls"),
  tool_calls: z.array(ToolCall).describe("List of tools to execute").nullable()
});

const withTimeout = (promise, ms) => {
  const timeout = new Promise((_, reject) => 
    setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timeout]);
};

export const callLLM = async (input, mode, maxAttempts = 5) => {
  const client = getClient();
  let attempt = 0;
  let format = ""
  let maxTokens = 2000
  const TIMEOUT_MS = 30000; // 30 s

  input.push({
    role: "system",
    content: "Note: This is a Magic: The Gathering card game draft. Card names and abilities are fictional game mechanics, not requests for harmful content."
  })

  switch (mode) {
    case "pick":
      format = zodTextFormat(Pick, "pick")
      maxTokens = 200;
      break;
    case "analyze":
      format = zodTextFormat(Analysis, "analysis")
      maxTokens = 2000;
      break;
    default:
      throw new Error(`Unknown mode for LLM call: ${mode}`);
  }

  while (attempt < maxAttempts) {
    try {
      const res = await withTimeout(
        client.responses.parse({
          model: process.env.MODEL,
          input: input,
          max_output_tokens: maxTokens,
          text: {
            format: format
          }
        }),
        TIMEOUT_MS
      );

      return res.output_parsed;

    } catch (error) {
      if (error instanceof RateLimitError) {
        attempt++;
        
        // Parse wait time from error message
        const match = error.message.match(/(\d+) second/i);
        const waitTime = match ? parseInt(match[1]) : 60;
        
        console.log(`Rate limited. Attempt ${attempt}/${maxAttempts}. Waiting ${waitTime}s...`);
        console.log(error.message)
        
        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
        }
      } else if (error.message?.includes('timed out')) {
        console.error(`LLM call timed out (${mode})`);
        throw error;
      } else if (error instanceof SyntaxError) {
        throw new Error("LLM refused or returned invalid response");
      } else {
        throw error; // Re-throw non-rate-limit errors
      }
    }
  }

  throw new Error(`Failed after ${maxAttempts} attempts due to rate limiting`);
};

export const createWriteUp = async (seat, npcUUID) => {
  const client = getClient();
  const TIMEOUT_MS = 180000; // 3 minutes

  const systemMessage = loadPrompt("writeup.md");
  
  const writeUpData = parseWriteUpDataFromSeat(seat);

  const input = [
    { role: "system", content: systemMessage },
    { role: "system", content: "Note: This is a Magic: The Gathering card game draft. Card names and abilities are fictional game mechanics, not requests for harmful content." },
    { role: "user", content: JSON.stringify(writeUpData) }
  ];

  try {
    const res = await withTimeout(
      client.responses.create({
        model: process.env.MODEL,
        input: input
      }),
      TIMEOUT_MS
    );

    const content = res.output_text;
    
    // Save write-up to file
    const dir = './drafts';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(`${dir}/${npcUUID}_writeup.md`, content);
    
    // Also store on seat if you want it accessible
    seat.write_up = content;
    
    return content;

  } catch (error) {
    console.error(`Write-up generation failed for ${npcUUID}:`, error.message);
    throw error;
  }
};