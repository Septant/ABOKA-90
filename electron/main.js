const { app, BrowserWindow } = require("electron");
const path = require("path");
const dbModule = require("./db");

const isDev = !app.isPackaged;

async function createWindow() {
  const dbPath = path.join(app.getPath("userData"), "db.json");

  // Инициализация базы данных
  dbModule.initLowDB(dbPath); // ИМЕННО initLowDB, а не createDB
  await dbModule.initDB(); // Инициализация данных

  const win = new BrowserWindow({
    width: 2560,
    height: 1440,
    icon: path.join(__dirname, "assets/icons/clear-sky.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isDev) {
    win.loadURL("http://localhost:4200"); // Angular dev сервер
  } else {
    win.loadFile(path.join(__dirname, "dist/my-electron-app/index.html"));
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
