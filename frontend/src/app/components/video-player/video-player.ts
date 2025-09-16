import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  signal,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-video-player',
  imports: [],
  templateUrl: './video-player.html',
  styleUrl: './video-player.scss',
})
export class VideoPlayer {
  @Input() videoSrc: string | null = null;

  @Output() videoFinished = new EventEmitter();
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  repeatCount = 0;
  onVideoEnded() {
    this.repeatCount++;
    if (this.repeatCount < 3) {
      this.videoPlayer.nativeElement.play();
    } else {
      this.videoFinished.emit();
    }
  }
}
