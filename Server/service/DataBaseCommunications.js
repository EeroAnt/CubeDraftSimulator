import axios from 'axios';
import { broadcastUserlist } from './Broadcasts.js';
import { drafts, users, connections } from './State.js';

export function getDraft(
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
  console.log("User ID: " + uuid);

  axios.get(
    process.env.FLASK_URL+
    `/${player_count}`+
    `/${token}`+
    `/${commander_packs_included}`+
    `/${normal_rounds}`+
    `/${multi_ratio}/`+
    `${generic_ratio}/`+
    `${colorless_ratio}/`+
    `${land_ratio}`
  ).then(res => {

    const data = res.data;
    console.log(data);
    if (data.state === "Setup Complete") {
      drafts[token] = {
        token : token,
        player_count : player_count,
        players : [users[uuid]],
        round : -1*commander_packs_included,
        direction : -1,
        picks : {},
        commanderpicks : {},
        picked_packs : []
      };

      drafts[token].table = data.table;
      drafts[token].rounds = data.rounds;
      drafts[token].state = data.state;

      connections[uuid].send(JSON.stringify({ status: "Setup OK"}));
      broadcastUserlist(drafts[token]);

    } else if (data.state === "Setup Failed") {
      console.log(data);
      connections[uuid].send(JSON.stringify({
        status: "Setup Failed",
        errors: data.errors
      }));
      users[uuid].token = "";
    } else {
      connections[uuid].send(JSON.stringify({
      status: "Setup Failed",
      error: "Unknown Error"
    }));

  }})
    .catch(error => {
      console.error('Error fetching data:', error);
      connections[uuid].send(JSON.stringify({
      status: "Setup Failed",
      error: "Connection Error"
    }));

  });
}

export function sendDraftData(data) {
  axios.post(process.env.FLASK_URL+'/draftdata', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => {
	  console.log(res.data);
  }).catch(error => {
  	console.error('Error sending data:', error);
  });
}