import axios from 'axios';
import { drafts, users } from './State.js';

export async function getDraft(
  token,
  player_count,
  uuid,
  commander_packs_included,
  normal_rounds,
  multi_ratio,
  generic_ratio,
  colorless_ratio,
  land_ratio
) {

  console.log("Getting Draft");
  try {
    const response = await axios.get(
      process.env.FLASK_URL +
      `/${player_count}` +
      `/${token}` +
      `/${commander_packs_included}` +
      `/${normal_rounds}` +
      `/${multi_ratio}/` +
      `${generic_ratio}/` +
      `${colorless_ratio}/` +
      `${land_ratio}`
    );
    const data = response.data;
    if (data.state === "Setup Complete") {
      drafts[token] = {
        token: token,
        player_count: player_count,
        players: [users[uuid]],
        round: -1 * commander_packs_included,
        direction: -1,
        picks: {},
        commanderpicks: {},
        picked_packs: []
      };

      drafts[token].table = data.table;
      drafts[token].rounds = data.rounds;
      drafts[token].state = data.state;

      const message = { status: "Setup OK" };
      return message;

    } else if (data.state === "Setup Failed") {
      console.log(data);
      const message = { status: "Setup Failed", errors: data.errors };
      users[uuid].token = "";
      return message;

    } else {
      const message = { status: "Setup Failed", error: "Unknown Error" };
      return message;

    }
  } catch (error) {
    console.error('Error getting draft:', error);
  }
}

export function sendDraftData(data) {
  axios.post(process.env.FLASK_URL + '/draftdata', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => {
    console.log(res.data);
  }).catch(error => {
    console.error('Error sending data:', error);
  });
}