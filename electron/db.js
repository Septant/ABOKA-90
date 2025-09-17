const { Low } = require("lowdb");
const { JSONFile } = require("lowdb/node");

let db;

function initLowDB(dbPath) {
  const adapter = new JSONFile(dbPath);
  db = new Low(adapter, { artifacts: [] });
  return db;
}

async function initDB() {
  await db.read();
  db.data ||= { artifacts: [] };

  if (!db.data.artifacts.length) {
    const initialArtifacts = [
      "Батарейка",
      "Компас",
      "Кристалл",
      "Мамины бусы",
      "Синяя капля",
    ];

    initialArtifacts.forEach((name, idx) => {
      if (!db.data.artifacts.find((a) => a.name === name)) {
        db.data.artifacts.push({
          idx: idx + 1,
          artifact: name,
          scan: {},
          report: "",
          createdBySystem: true,
        });
      }
    });
    await db.write();
  }
}

async function getArtifacts() {
  await db.read();
  return db.data.artifacts;
}

async function addArtifact(artifact) {
  await db.read();
  db.data.artifacts.push({
    ...artifact,
    createdBySystem: false,
  });
  await db.write();
  return db.data.artifacts;
}

async function updateArtifactName({ artifactId, newName }) {
  await db.read();
  const found = db.data.artifacts.find((art) => art.idx === artifactId);
  found.artifact = newName;

  await db.write();
  return db.data.artifacts;
}

async function updateArtifactScan(artifactId, scanData) {
  await db.read();
  const artifact = db.data.artifacts.find((a) => a.idx === artifactId);

  if (artifact) {
    artifact.scan.date = scanData.date;
    artifact.scan.src = scanData.src;
    await db.write();
  }
  return true;
}

async function updateArtifactReport(artifactId, report) {
  await db.read();
  const artifact = db.data.artifacts.find((a) => a.idx === artifactId);
  if (artifact) {
    artifact.report = report;
    await db.write();
  }
  return true;
}

async function dropDB() {
  await db.read();
  db.data = { artifacts: [] }; // «обнулили» БД
  await db.write();
  await initDB();
  return true;
}
module.exports = {
  initLowDB,
  initDB,
  getArtifacts,
  addArtifact,
  updateArtifactName,
  updateArtifactScan,
  updateArtifactReport,
  dropDB,
};
