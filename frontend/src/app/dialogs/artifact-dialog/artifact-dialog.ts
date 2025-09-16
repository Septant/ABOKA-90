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
import { VideoPlayer } from '../../components/video-player/video-player';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, timer } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { HackService } from '../../services/hack.service';

@Component({
  selector: 'app-artifact-dialog',
  imports: [
    MatIcon,
    MatDialogClose,
    MatButton,
    VideoPlayer,
    AsyncPipe,
    DatePipe,
  ],
  templateUrl: './artifact-dialog.html',
  styleUrl: './artifact-dialog.scss',
})
export class ArtifactDialog {
  private dialogRef = inject(MatDialogRef<ArtifactDialog>);
  private dataService = inject(DataService);
  public hackService = inject(HackService);
  dateNow$ = timer(0, 1000).pipe(
    map(() => new Date()),
    takeUntilDestroyed()
  );
  videoSrc: string | null = null;

  isFinished = signal(false);

  constructor(@Inject(MAT_DIALOG_DATA) public artifact: Artifact) {}

  async startScan() {
    this.isFinished.set(false);
    this.videoSrc = null;
    this.videoSrc = await this.dataService.getRandomArtifactVideo(
      this.artifact.artifact
    );

    this.videoSrc = `${this.videoSrc}?t=${Date.now()}`;
  }

  async finishScan() {
    await this.dataService
      .updateArtifactScan(
        this.artifact.idx!,
        new Date(),
        this.videoSrc!.substring(0, this.videoSrc!.indexOf('?'))
      )
      .then((response: boolean) => {
        if (response) {
          this.videoSrc = null;
          this.isFinished.set(false);
          this.dialogRef.close('success');
        }
      });
  }

  onVideoFinished() {
    this.isFinished.set(true);
  }
}
