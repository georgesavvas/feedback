import React, {createContext, useEffect, useRef, useState} from "react";

import {longSocket} from "../services/serverWebSocket";
import {v4 as uuid} from "uuid";

// import {useSnackbar} from "notistack";


const SESSION_ID = uuid();

const createChatsSocket = (user, host, config) => {
  return longSocket("chats", user, host, SESSION_ID, config);
};

const destroySocket = socket => {
  if (!socket.current) return;
  socket.current.close();
  socket.current = undefined;
};

export const ConfigContext = createContext();

export const ConfigProvider = props => {
  const [user, setUser] = useState();
  const [host, setHost] = useState();
  const chatsSocket = useRef();
  const [forceRefresh, setForceRefresh] = useState(0);

  const handleChatsSocketMessage = e => {
    if (!e.data) return;
    const resp = JSON.parse(e.data);
    if (!resp.data) return;
    const data = resp.data;
    console.log("Received", data);
    if (Array.isArray(data)) return;
  };

  useEffect(() => {
    // window.services.get_user().then(resp => setUser(resp));
    // window.services.get_env("HOSTNAME").then(resp => setHost(resp));
  }, []);

  useEffect(() => {
    if (!user || !host) return;
    if (chatsSocket.current) return;
    const websocketConfig = {
      timeout: 5000,
      onmessage: handleChatsSocketMessage,
      onerror: e => console.log("Error", e),
      onopen: e => console.log("Connected!", e),
      onclose: e => {
        console.log("Closed!", e);
        chatsSocket.current = undefined;
      },
      onreconnect: e => console.log("Reconnecting...", e),
    };
    createChatsSocket(user, host, websocketConfig).then(ws => {
      chatsSocket.current = ws;
    });
    return (() => destroySocket(chatsSocket));
  }, [user, host]);

  return (
    <ConfigContext.Provider value={{
      host,
      user,
      forceRefresh: forceRefresh,
    }}>
      {props.children}
    </ConfigContext.Provider>
  );
};
