import { loadPrompt } from "./PromptReader.js";
import { callLLM } from "./Caller.js";
import { getNPCState, parseAnalysisDataFromSeat } from "../Utils.js";
import { operateTools } from "./Tools.js";


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
  const data = {
    card: response.card_id,
    reasoning: response.reasoning,
  };
  if (response.tags) data.tags = response.tags;
  // Parse response to extract card ID and reasoning
  return data
};

export const analyzePoolWithLLM = async (seat, npcUUID) => {
  const max_loop = 5;
  let call_number = 0;
  let response;
  let badCalls = [];

  const systemMessage = (
    loadPrompt("analyzer.md") +
    loadPrompt("default_commander_rule.md") +
    loadPrompt("tools.md")
  );

  while (call_number < max_loop) {
    call_number++;
    
    const state = getNPCState(npcUUID);
    const analysisData = parseAnalysisDataFromSeat(seat, state.reasoning);
    
    const input = [
      { role: "system", content: systemMessage },
      { role: "system", content: `This is analysis call ${call_number} out of ${max_loop}`},
      { role: "user", content: JSON.stringify(analysisData) }
    ];
    if (state.packsRemaining) {
      input.push({
        role: "system",
        content: `There are ${state.packsRemaining} rounds of packs of 15 left after this pack has finished.`
      })
    }

    if (state.hasCardsToPickFrom) {
      input.push({
        role: "system",
        content: "Cards are waiting. Finalize your summary now."
      });
    }

    if (badCalls.length) {
      input.push(
        {
          role: "system",
          content: JSON.stringify(badCalls)
        }
      )
    }

    response = await callLLM(input, "analyze");
    
    if (response.analysis_ready || state.hasCardsToPickFrom) break;
    
    if (response.tool_calls) {
      badCalls = operateTools(response.tool_calls, seat);
    }
  }
  
  return response;
};