import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  Inject,
  signal,
  ViewChild,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Artifact } from '../../../meta/artifact.meta';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-artifact-dialog',
  imports: [MatIcon, MatDialogClose, MatButton],
  templateUrl: './artifact-dialog.html',
  styleUrl: './artifact-dialog.scss',
})
export class ArtifactDialog {
  private dialogRef = inject(MatDialogRef<ArtifactDialog>);
  private dataService = inject(DataService);
  private _cdr = inject(ChangeDetectorRef);

  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  videoSrc: string | null = null;
  repeatCount = 0;
  isFinished = signal(false);

  constructor(@Inject(MAT_DIALOG_DATA) public artifact: Artifact) {}

  async startScan() {
    this.repeatCount = 0;
    this.isFinished.set(false);
    this.videoSrc = await this.dataService
      .getRandomArtifactVideo(this.artifact.artifact)
      .then((ref: any) => {
        console.log(ref);
        return ref;
      });
  }

  onVideoEnded() {
    this.repeatCount++;
    if (this.repeatCount < 3) {
      this.videoPlayer.nativeElement.play();
    } else {
      this.isFinished.set(true);
    }
  }

  async finishScan() {
    await this.dataService
      .updateArtifactScan(this.artifact.idx!, new Date(), this.videoSrc!)
      .then((response: boolean) => {
        if (response) {
          this.videoSrc = null;
          this.isFinished.set(false);
          this._cdr.detectChanges();
          this.dialogRef.close('success');
        }
      });
  }
}
