const path = require("path");
const { Low } = require("lowdb");
const { JSONFile } = require("lowdb/node"); // важно: /node для Node.js среды

let db;

function initLowDB(dbPath) {
  const adapter = new JSONFile(dbPath);
  db = new Low(adapter, { artifacts: [] });
  return db;
}

// Инициализация базы данных
async function initDB() {
  await db.read();

  // Если базы ещё нет — создаём структуру
  db.data ||= { artifacts: [] };

  // Первые 5 артов, которые нельзя менять
  const initialArtifacts = [
    "Батарейка",
    "Компас",
    "Кристалл",
    "Мамины бусы",
    "Синяя капля",
  ];

  initialArtifacts.forEach((name) => {
    if (!db.data.artifacts.find((a) => a.name === name)) {
      db.data.artifacts.push({
        name,
        scanHistory: [], // Массив сканирований
        report: "", // Отчёт
        createdBySystem: true, // Нельзя редактировать
      });
    }
  });

  await db.write();
}

// Добавление нового артефакта
async function addArtifact(name) {
  await db.read();
  db.data.artifacts.push({
    name,
    scanHistory: [],
    report: "",
    createdBySystem: false,
  });
  await db.write();
}

// Добавление записи о сканировании
async function addScan(artifactName, videoFile) {
  await db.read();
  const artifact = db.data.artifacts.find((a) => a.name === artifactName);
  if (!artifact) return;
  artifact.scanHistory.push({
    datetime: new Date().toISOString(),
    video: videoFile,
  });
  await db.write();
}

// Обновление отчёта
async function updateReport(artifactName, reportText) {
  await db.read();
  const artifact = db.data.artifacts.find((a) => a.name === artifactName);
  if (!artifact) return;
  artifact.report = reportText;
  await db.write();
}

// Получение всех артефактов
async function getArtifacts() {
  await db.read();
  return db.data.artifacts;
}

// Экспорт функций
module.exports = {
  initLowDB,
  initDB,
  addArtifact,
  addScan,
  updateReport,
  getArtifacts,
};
