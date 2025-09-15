const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const dbModule = require("./db.js");
const fs = require("fs");
const isDev = !app.isPackaged;

async function createWindow() {
  const dbPath = path.join(app.getPath("userData"), "db.json");
  console.log(dbPath);
  // Инициализация базы данных
  dbModule.initLowDB(dbPath); // ИМЕННО initLowDB, а не createDB
  await dbModule.initDB(); // Инициализация данных

  const win = new BrowserWindow({
    width: 2560,
    height: 1440,
    icon: path.join(__dirname, "assets/icons/clear-sky.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false,
    },
  });

  console.log(isDev);
  if (isDev) {
    win.loadURL("http://localhost:4200"); // Angular dev сервер
  } else {
    const indexPath = path.join(
      __dirname,
      "dist",
      "ABOKA-90",
      "browser",
      "index.html"
    );
    console.log("Loading index.html from:", indexPath);
    win.loadFile(indexPath);
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// IPC обработчики для Angular
ipcMain.handle("get-artifacts", async () => {
  return await dbModule.getArtifacts();
});

ipcMain.handle("add-artifact", async (event, artifact) => {
  return await dbModule.addArtifact(artifact);
});

ipcMain.handle("update-artifact", async (event, { artifactId, newName }) => {
  return await dbModule.updateArtifactName({ artifactId, newName });
});

ipcMain.handle("getRandomArtifactVideo", async (event, artifactName) => {
  const videosDir = path.join(__dirname, "assets/videos"); // укажи правильный путь
  const files = fs.readdirSync(videosDir);

  // фильтруем по artifactName
  const filtered = files.filter((f) =>
    f.toLowerCase().includes(artifactName.toLowerCase())
  );

  if (filtered.length === 0) return null;

  // случайный выбор
  const randomFile = filtered[Math.floor(Math.random() * filtered.length)];
  return path.join(videosDir, randomFile);
});

ipcMain.handle(
  "updateArtifactScan",
  async (event, { artifactId, scanData }) =>
    await dbModule.updateArtifactScan(artifactId, scanData)
);
