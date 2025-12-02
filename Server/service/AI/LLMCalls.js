import { loadPrompt } from "./PromptReader.js";
import { callLLM } from "./Caller.js";


export const pickCardWithLLM = async (seat) => {
  
  const systemMessage = loadPrompt("pick_a_card.md")
  
  const input = [
    {
      role: "system",
      content: systemMessage
    }
  ]
  input.push(
    {
      role: "system",
      content: JSON.stringify(seat.packAtHand.cards)
    }
  )
  const response = await callLLM(input, "pick")
  // Parse response to extract card ID and reasoning
  return {
    card: response.card_id,
    reasoning: response.reasoning
  };
};
