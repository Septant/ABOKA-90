import { Injectable } from '@angular/core';
import { Artifact } from '../../meta/artifact.meta';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  loadArtifacts() {
    return (window as any).api.getArtifacts();
  }

  addArtifact(artifact: Artifact) {
    return (window as any).api.addArtifact(artifact);
  }

  updateArtifactName(artifactId: number, newName: string) {
    return (window as any).api.updateArtifactName({ artifactId, newName });
  }

  getRandomArtifactVideo(artifact: string) {
    return (window as any).api.getRandomArtifactVideo(artifact);
  }

  updateArtifactScan(idx: number, date: Date, src: string) {
    return (window as any).api.updateArtifactScan(idx, {
      date,
      src,
    });
  }

  updateArtifactReport(idx: number, report: string) {
    return (window as any).api.updateArtifactReport(idx, report);
  }
}
