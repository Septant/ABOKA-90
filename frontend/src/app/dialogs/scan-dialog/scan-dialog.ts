import {
  Component,
  ElementRef,
  Inject,
  signal,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { VideoPlayer } from '../../components/video-player/video-player';
import { MatButton } from '@angular/material/button';
import { Artifact } from '../../../meta/artifact.meta';

@Component({
  selector: 'app-scan-dialog',
  imports: [MatIcon, MatDialogClose, VideoPlayer, MatButton],
  templateUrl: './scan-dialog.html',
  styleUrl: './scan-dialog.scss',
})
export class ScanDialog {
  @ViewChild(VideoPlayer) videoPlayer!: ElementRef<VideoPlayer>;
  videoPlay = signal(false);
  temporalSrc!: string;
  constructor(@Inject(MAT_DIALOG_DATA) public artifact: Artifact) {}

  watchScan() {
    this.videoPlay.set(true);
  }
  onVideoFinished() {
    this.videoPlay.set(false);
  }
}
