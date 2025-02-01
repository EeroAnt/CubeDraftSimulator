import { users, drafts } from "./State.js";
import { getDraft } from "./DataBaseCommunications.js";
import { sendMessage } from "./Messaging.js";
import { broadcastUserlist } from "./Broadcasts.js";

export async function createLobby(data, uuid) {

  if (users[uuid].token === "") {

    users[uuid].token = data.token;
    const commander_pack_included = data.commander_pack_included ? 1 : 0;

    try {
      const message = await getDraft(
        data.token,
        data.player_count,
        uuid,
        commander_pack_included,
        data.number_of_rounds,
        data.multi_ratio,
        data.generic_ratio,
        data.colorless_ratio,
        data.land_ratio
      );

      sendMessage(uuid, message);
      console.log(message);

      if (message.status === "Setup OK") {

        broadcastUserlist(drafts[data.token]);
      
      }

    } catch (error) {
      
      console.log(error);
    
    }

  } else {
    console.log("Wait for setting up the draft");
  }
}