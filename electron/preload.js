const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  getArtifacts: () => ipcRenderer.invoke("get-artifacts"),
  addArtifact: (artifact) => ipcRenderer.invoke("add-artifact", artifact),
  updateArtifactName: ({ artifactId, newName }) =>
    ipcRenderer.invoke("update-artifact", { artifactId, newName }),
  getRandomArtifactVideo: (artifactName) =>
    ipcRenderer.invoke("getRandomArtifactVideo", artifactName),
  updateArtifactScan: (artifactId, scanData) =>
    ipcRenderer.invoke("updateArtifactScan", { artifactId, scanData }),
  updateArtifactReport: (artifactId, report) =>
    ipcRenderer.invoke("updateArtifactReport", { artifactId, report }),
  dropDB: () => ipcRenderer.invoke("dropDB"),
});
