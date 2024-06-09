// eslint-disable-next-line @typescript-eslint/no-var-requires
const {ipcRenderer, contextBridge} = require("electron");

contextBridge.exposeInMainWorld("db", {
  insert: data => {
    ipcRenderer.invoke("db_insert", data);
  },
  find: (query, fn) => {
    return ipcRenderer.invoke("db_find", query, fn);
  },
  update: (query, data) => {
    ipcRenderer.invoke("db_update", query, data);
  },
  remove: query => {
    ipcRenderer.invoke("db_remove", query);
  },
});

contextBridge.exposeInMainWorld("cryptoApi", {
  encryptWithKey: (key, data) => {
    return ipcRenderer.invoke("encryptWithKey", key, data);
  },
  decryptWithKey: (key, data) => {
    return ipcRenderer.invoke("decryptWithKey", key, data);
  },
  generate: () => {
    return ipcRenderer.invoke("generateKeyPair");
  },
  encrypt: (key, data) => {
    return ipcRenderer.invoke("encrypt", key, data);
  },
  decrypt: (key, data) => {
    return ipcRenderer.invoke("decrypt", key, data);
  },
});

contextBridge.exposeInMainWorld("api", {
  startDrag: fileName => {
    ipcRenderer.send("ondragstart", fileName);
  },
  storeData: async (filename, data) => {
    return await ipcRenderer.invoke("store_data", filename, data);
  },
  loadData: async (filename) => {
    return await ipcRenderer.invoke("load_data", filename);
  },
  checkPath: (filepath) => {
    return ipcRenderer.invoke("check_path", filepath);
  },
  fileInput: async properties => {
    return await ipcRenderer.invoke("file_input", properties);
  },
  dirInput: async properties => {
    return await ipcRenderer.invoke("dir_input", properties);
  },
  getPathType: filepath => {
    return ipcRenderer.invoke("get_path_type", filepath);
  },
  isDir: filepath => {
    return ipcRenderer.invoke("is_dir", filepath);
  },
  isFile: filepath => {
    return ipcRenderer.invoke("is_file", filepath);
  },
  getFiles: async (path, pattern) => {
    return await ipcRenderer.invoke("get_files", path, pattern);
  },
  run_cmd: async (cmd, args, env) => {
    return await ipcRenderer.invoke("run_cmd", cmd, args, env);
  },
  get_server_url: () => {
    return ipcRenderer.invoke("get_server_url");
  },
});

contextBridge.exposeInMainWorld("services", {
  client_progress: callback => ipcRenderer.on("client_progress", callback),
  update_available: callback => {
    ipcRenderer.on("update_available", callback);
    return () => ipcRenderer.removeListener("update_available", callback);
  },
  onResourceUsage: callback => {
    ipcRenderer.removeAllListeners("resource_usage");
    ipcRenderer.on("resource_usage", callback);
  },
  onAutoUpdater: callback => {
    ipcRenderer.removeAllListeners("autoUpdater");
    ipcRenderer.on("autoUpdater", callback);
  },
  check_backend: () => {
    return ipcRenderer.invoke("check_backend");
  },
  get_env: env_name => {
    return ipcRenderer.invoke("get_env", env_name);
  },
  get_user: () => {
    return ipcRenderer.invoke("get_user");
  },
  get_version: () => {
    return ipcRenderer.invoke("get_version");
  },
  restart: () => {
    return ipcRenderer.invoke("restart");
  },
  uuid: () => {
    return ipcRenderer.invoke("uuid");
  },
  open_url: url => {
    return ipcRenderer.invoke("open_url", url);
  },
  show_in_explorer: path => {
    return ipcRenderer.invoke("show_in_explorer", path);
  },
  set_env: (env_name, env_value) => {
    ipcRenderer.invoke("set_env", env_name, env_value);
  },
  set_envs: data => {
    ipcRenderer.invoke("set_envs", data);
  },
  get_port: () => {
    return ipcRenderer.invoke("get_port");
  }
});
