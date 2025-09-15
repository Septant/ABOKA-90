export interface Artifact {
  idx: number | null;
  artifact: string;
  scan?: {
    date: Date;
    videoPath: string;
  };
  report: string | null;
  createdBySystem: boolean;
}
