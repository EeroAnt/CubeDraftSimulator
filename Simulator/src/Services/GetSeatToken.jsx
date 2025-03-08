import { sendMessage } from "./sendMessage";

export const getSeatToken = (connection) => {
  const message = { status: "OK", type: "Get Seat Token" };
  sendMessage(connection, message);
}