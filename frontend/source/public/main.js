/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-var-requires */

const {app, BrowserWindow, protocol, ipcMain, dialog, Tray, Menu, shell} = require("electron");
const os = require("os");
const fs = require("fs");
const {lstatSync, realpathSync} = require("fs");
const path = require("path");
require("v8-compile-cache");
const uuid4 = require("uuid4");
const {spawn} = require("child_process");
const {globSync} = require("glob");

app.disableHardwareAcceleration(false);
console.log(app.getGPUFeatureStatus());

const sessionID = uuid4();
let platformName = process.platform;
const userHomeDir = os.homedir();
let appPath = app.getAppPath();
if (platformName === "win32") {
  appPath = path.dirname(app.getPath("exe"));
}
else if (appPath.endsWith("app.asar")) {
  appPath = path.dirname(app.getPath("exe"));
  appPath = path.join(appPath, "..");
}
const resourcesPath = process.resourcesPath;
// console.log("appPath:", appPath);
// console.log("resourcesPath", resourcesPath);
process.env.REVIEW = sessionID;
let appQuitting = false;
let tray = null;
let splash = null;
let window = null;
const isDev = process.env.NODE_ENV === "dev";
const public = path.join(__dirname, "..", isDev ? "public" : "build");
let modtime = -1;

const iconPaths = {
  "win32": "media/desktop_icon/win/icon.ico",
  "darwin": "media/desktop_icon/mac/icon.icns",
  "linux": "media/desktop_icon/linux/icon.png"
};

const commandBuilder = (
  _cmd,
  args=[],
  options={shell: false, persist: false, title: ""}
) => {
  const cmd = [`konsole --nofork --workdir ${userHomeDir}`];
  if (options.title) cmd.push(`-p tabtitle="${options.title}"`);
  const hold_cmd = options.persist && options.shell ? ";bash" : "";
  cmd.push(`-e bash -c '${_cmd}${args.join(" ")}${hold_cmd}'`);
  return cmd.join(" ");
};

const ensureDir = path => {
  try {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
  } catch (e) {
    console.error(e);
  }
};

const reviewHome = path.join(os.homedir(), ".review");
ensureDir(reviewHome);

function createWindow (show=true) {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    show: show,
    icon: path.join(__dirname, iconPaths[platformName]),
    backgroundColor: "#141414",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    }
  });

  if (isDev) {
    console.log("Loading development environment...");
    win.loadURL("http://localhost:3000");
    win.webContents.openDevTools();
  } else {
    console.log("Production build");
    // win.webContents.openDevTools();
    win.removeMenu();
    win.loadFile("build/index.html");
  }

  win.on("close", e => {
    if (!appQuitting) {
      e.preventDefault();
      win.hide();
    }
  });

  ipcMain.handle("store_data", (e, filename, data) => {
    const filepath = path.join(reviewHome, filename);
    return fs.promises.writeFile(filepath, data, "utf8").catch(() => {});
  });

  ipcMain.handle("load_data", (e, filename) => {
    const filepath = path.join(reviewHome, filename);
    return fs.promises.readFile(filepath, "utf8").catch(() => {});
  });

  ipcMain.handle("open_url", async (e, url) => {
    shell.openExternal(url);
  });

  ipcMain.handle("get_version", () => {
    return app.getVersion();
  });

  ipcMain.handle("get_user", () => {
    if (isDev) return process.env["USER"];
    return os.userInfo().username;
  });

  ipcMain.handle("check_path", async (e, filepath) => {
    let valid = true;
    try {
      await fs.promises.access(filepath);
    } catch (err) {
      valid = false;
    }
    return valid;
  });

  ipcMain.handle("get_path_type", (e, filepath) => {
    try {
      const stat = lstatSync(realpathSync(filepath));
      if (stat.isDirectory()) return "directory";
      else if (stat.isFile()) return "file";
      return;
    } catch (err) {
      console.log(err);
      return false;
    }
  });

  ipcMain.handle("is_dir", (e, filepath) => {
    try {
      var stat = lstatSync(path.resolve(filepath));
      return stat.isDirectory();
    } catch (err) {
      console.log(err);
      return false;
    }
  });

  ipcMain.handle("is_file", (e, filepath) => {
    try {
      var stat = lstatSync(path.resolve(filepath));
      return stat.isFile();
    } catch (err) {
      console.log(err);
      return false;
    }
  });

  ipcMain.handle("get_files", async (e, path, pattern="**/*") => {
    console.log("glob", path, pattern);
    return globSync(pattern, {
      cwd: path,
      root: "",
      absolute: true,
      nodir: true,
      follow: true
    });
  });

  ipcMain.handle("dir_input", async (e, properties=[]) => {
    const settings = {properties: ["openDirectory", ...properties]};
    return await dialog.showOpenDialog(win, settings);
  });

  ipcMain.handle("file_input", async (e, properties=[]) => {
    const settings = {properties: ["openFile", ...properties]};
    return await dialog.showOpenDialog(win, settings);
  });

  ipcMain.handle("get_env", (e, env_name) => {
    return process.env[env_name];
  });

  ipcMain.handle("uuid", () => {
    return uuid4();
  });

  ipcMain.on("ondragstart", (event, filePath) => {
    event.sender.startDrag({
      file: path.join(__dirname, filePath),
      // icon: iconName,
    });
  });

  ipcMain.handle("set_env", (e, env_name, env_value) => {
    process.env[env_name] = env_value;
  });

  ipcMain.handle("set_envs", (e, data) => {
    for (const [env_name, env_value] of Object.entries(data)) {
      process.env[env_name] = env_value;
    }
  });

  ipcMain.handle("get_server_url", () => {
    return app.commandLine.getSwitchValue("server") || "localhost:8092";
  });

  ipcMain.handle("show_in_explorer", (e, filepath) => {
    shell.showItemInFolder(filepath);
  });

  ipcMain.handle("restart", () => {
    app.relaunch();
    app.exit();
  });

  ipcMain.handle(
    "run_cmd",
    async (e, _cmd, args, options={shell: false, persist: false}) => {
      const cmd = commandBuilder(_cmd, args, options);
      console.log("Running", `"${cmd}"`);
      if (options.env) console.log("With env", options.env);
      const dccEnv = {...process.env, ...(options.env || {})};
      const proc = spawn(cmd, {shell: true, detached: true, env: dccEnv});
      if (proc) {
        proc.unref();
        return true;
      }
    }
  );

  return win;
}

function createSplash () {
  const win = new BrowserWindow({
    width: 600,
    height: 350,
    transparent: true,
    frame: false,
    backgroundColor: "#141414",
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js")
    },
    icon: path.join(__dirname, iconPaths[platformName])
  });
  win.loadFile(`${public}/splash.html`);
  return win;
}

const gotTheLock = app.requestSingleInstanceLock(sessionID);

if (!gotTheLock) app.quit();
else {
  app.on("second-instance", () => {
    if (window) {
      if (window.isMinimized()) window.restore();
      window.show();
      window.focus();
    }
  });
}

const checkForUpdates = window => {
  fs.promises.stat(path.join(resourcesPath, "app.asar")).then(stats => {
    if (modtime < 0) {
      modtime = stats.mtime;
    }
    else if (modtime < stats.mtime) {
      setTimeout(() => checkForUpdates(window), 1000 * 60 * 5);
      return;
    }
    else window.webContents.send("update_available", true);
  }).catch(error => console.log(error));
};

app.whenReady().then(async () => {
  splash = createSplash();
  window = createWindow(false);
  window.once("ready-to-show", () => {
    splash.destroy();
    window.show();
  });

  if (!isDev) checkForUpdates(window);

  if (tray === null) tray = new Tray(`${public}/media/icon_dark.png`);
  const contextMenu = Menu.buildFromTemplate([
    { label: "Show", click: () => window.show() },
    { label: "Exit", click: () => app.quit() },
  ]);
  tray.setToolTip("Review");
  tray.setContextMenu(contextMenu);
  tray.on("click", () => window.show());
  tray.on("double-click", () => window.show());
});

app.on("ready", async () => {
  const protocolName = "local";
  protocol.registerFileProtocol(protocolName, (request, callback) => {
    const url = request.url.replace(`${protocolName}://`, "");
    try {
      return callback(decodeURIComponent(url));
    }
    catch (error) {
      console.error(error);
    }
  });
});

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }
// })

app.on("before-quit", () => {
  appQuitting = true;
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    window = createWindow();
  }
});
