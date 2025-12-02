import { loadPrompt } from "./PromptReader.js";
import { callLLM } from "./Caller.js";
import { getNPCState } from "../Utils.js";


export const pickCardWithLLM = async (pickData) => {
  
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
      content: JSON.stringify(pickData)
    }
  )
  const response = await callLLM(input, "pick")
  // Parse response to extract card ID and reasoning
  return {
    card: response.card_id,
    reasoning: response.reasoning
  };
};

export const analyzePoolWithLLM = async (analysisData, npcUUID) => {
  const max_loop = 5;
  let call_number = 0;

  let response

  const systemMessage = loadPrompt("analyzer.md") + loadPrompt("default_commander_rule.md")

  
  while (call_number < max_loop) {
    call_number++;
    const input = [
      {
        role: "system",
        content: systemMessage
      }
    ]
    input.push(
      {
        role: "user",
        content: JSON.stringify(analysisData)
      }
    )
    const state = getNPCState(npcUUID)
    if (state.hasCardsToPickFrom) {
      input.push(
        {
          role: "system",
          content: "After this response, a new card will be picked. So this call has to provide a plan for that pick. No more tool calls"
        }
      )
    }
    response = await callLLM(input, "analyze")
    if (response.analysis_ready || state.hasCardsToPickFrom) break;
  }
  return response
}
