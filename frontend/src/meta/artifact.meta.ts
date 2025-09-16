export interface Artifact {
  idx: number | null;
  artifact: string;
  scan?: {
    date: Date;
    src: string;
  };
  report: string | null;
  createdBySystem: boolean;
}
