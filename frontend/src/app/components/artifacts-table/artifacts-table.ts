import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { DataService } from '../../services/data.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Artifact } from '../../../meta/artifact.meta';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ArtifactDialog } from '../../dialogs/artifact-dialog/artifact-dialog';
import { ScanDialog } from '../../dialogs/scan-dialog/scan-dialog';
import { ReportDialog } from '../../dialogs/report-dialog/report-dialog';
import { ReportViewMode } from '../../../meta/report-view-mode.type';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-artifacts-table',
  imports: [
    MatTableModule,
    AsyncPipe,
    FormsModule,
    MatInput,
    MatProgressSpinner,
    DatePipe,
    ScrollingModule,
  ],
  providers: [DatePipe],
  templateUrl: './artifacts-table.html',
  styleUrl: './artifacts-table.scss',
})
export class ArtifactsTable implements OnInit {
  private dataService = inject(DataService);
  private dialog = inject(MatDialog);
  private _cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  @ViewChild('addingElem') inputAddField!: ElementRef<HTMLInputElement>;
  @ViewChild('editingElem') inputEditField!: ElementRef<HTMLInputElement>;
  displayedColumns: string[] = ['idx', 'artifact', 'scan', 'report'];

  data$!: Promise<Artifact[]>;
  isAdding = false;
  isLoading = false;
  newArtifactValue = '';

  editingArtifactId: number | null = null;
  editingArtifactName: string = '';

  ngOnInit() {
    this.dataService.updateDataTrigger$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.loadData();
        this._cdr.markForCheck();
      });
  }

  loadData() {
    this.isLoading = true;
    this.data$ = this.dataService.loadArtifacts().finally(() => {
      this.isLoading = false;
      this._cdr.markForCheck();
    });
  }

  onArtifactClick(element: Artifact) {
    this.dialog
      .open(ArtifactDialog, {
        width: '1000px',
        height: '900px',
        disableClose: true,
        data: element,
      })
      .afterClosed()
      .subscribe((response: any) => {
        if (response === 'success') {
          this.dataService.updateDataTrigger$.next();
        }
      });
  }

  onArtifactFooterClick() {
    this.isAdding = true;
    this.newArtifactValue = '';
    setTimeout(() => this.inputAddField.nativeElement.focus());
  }

  onAddConfirm(dataLength: number) {
    if (!this.newArtifactValue.trim()) {
      this.isAdding = false;
      return;
    }

    this.isLoading = true;
    this.data$ = this.dataService
      .addArtifact({
        idx: dataLength + 1,
        artifact: this.newArtifactValue,
        scan: {} as { date: Date; src: string },
        report: '',
        createdBySystem: false,
      })
      .then((artifacts: Artifact[]) => {
        this.isAdding = false;
        return artifacts;
      })
      .finally(() => (this.isLoading = false));
  }

  onAddCancel() {
    this.isAdding = false;
  }

  onArtifactRightClick(e: Event, element: Artifact) {
    e.preventDefault();
    if (element.createdBySystem) return;
    setTimeout(() => this.inputEditField.nativeElement.focus());
    this.editingArtifactId = element.idx;
    this.editingArtifactName = element.artifact;
  }

  onEditConfirm(element: Artifact) {
    if (!this.editingArtifactName.trim()) {
      this.editingArtifactId = null;
      return;
    }

    this.isLoading = true;

    this.data$ = this.dataService
      .updateArtifactName(element.idx!, this.editingArtifactName)
      .then((updatedList: Artifact[]) => {
        this.editingArtifactId = null;
        this.editingArtifactName = '';
        return updatedList;
      })
      .finally(() => (this.isLoading = false));
  }

  onEditCancel() {
    this.editingArtifactId = null;
    this.editingArtifactName = '';
  }

  onArtifactScanClick(element: Artifact) {
    if (element.scan?.date) {
      this.dialog.open(ScanDialog, {
        data: element,
        disableClose: true,
        width: '1000px',
        height: '900px',
      });
    }
  }

  onArtifactReportCLick(mode: ReportViewMode, element: Artifact) {
    this.dialog
      .open(ReportDialog, {
        width: '1000px',
        height: '900px',
        disableClose: true,
        data: { mode, artifact: element },
      })
      .afterClosed()
      .subscribe((response) => {
        if (response === 'success') {
          this.dataService.updateDataTrigger$.next();
        }
      });
  }
}
