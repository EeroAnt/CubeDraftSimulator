export async function reconnect(username, token, seatToken, setUsername, setToken, setSeatToken) {
  if (username && token && seatToken) {
    console.log("Reconnecting to draft with seat token: ", seatToken);
    setUsername(username);
    setToken(token);
    setSeatToken(seatToken);
    const message = {
      type: "Rejoin Draft",
      username: username,
      token: token,
      seat: seatToken
    };
    return {message, newMode: "Draft"};
  } else if (username && token && !seatToken) {
    console.log("Reconnecting to lobby with token: ", token);
    setUsername(username);
    setToken(token);
    const message = {
      type: "Rejoin Lobby",
      username: username,
      token: token
    };
    return {message, newMode: "Lobby"};
  } else if (username && !token && !seatToken) {
    setUsername(username);
    console.log("Reconnecting to home with username: ", username);
    const message = {
      type: "Login",
      username: username
    };
    return {message, newMode: "Home"};
  } else {
    console.log("New connection");
    const message = {
      type: "Connect"
    };
    return {message, newMode: "Home"};
  }
}