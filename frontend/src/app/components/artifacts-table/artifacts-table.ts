import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { DataService } from '../../services/data.service';
import { AsyncPipe, CommonModule, DatePipe, NgIf } from '@angular/common';
import { Artifact } from '../../../meta/artifact.meta';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ArtifactDialog } from '../../dialogs/artifact-dialog/artifact-dialog';

@Component({
  selector: 'app-artifacts-table',
  imports: [
    MatTableModule,
    AsyncPipe,
    FormsModule,
    MatInput,
    MatProgressSpinner,
    DatePipe,
  ],
  providers: [DatePipe],
  templateUrl: './artifacts-table.html',
  styleUrl: './artifacts-table.scss',
})
export class ArtifactsTable implements OnInit {
  private dataService = inject(DataService);
  private dialog = inject(MatDialog);

  @ViewChild('addingElem') inputAddField!: ElementRef<HTMLInputElement>;
  @ViewChild('editingElem') inputEditField!: ElementRef<HTMLInputElement>;
  displayedColumns: string[] = ['idx', 'artifact', 'scan', 'report'];

  data$!: Promise<Artifact[]>;
  isAdding = false;
  isLoading = false;
  newArtifactValue = '';

  editingArtifactId: number | null = null;
  editingArtifactName: string = '';

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.data$ = this.dataService
      .loadArtifacts()
      .finally(() => (this.isLoading = false));
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
      .subscribe(async (response: any) => {
        if (response === 'success') {
          this.loadData();
        }
      });
  }

  onArtifactFooterClick() {
    this.isAdding = true;
    this.newArtifactValue = '';
    setTimeout(() => this.inputAddField.nativeElement.focus(), 0);
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
    setTimeout(() => this.inputEditField.nativeElement.focus(), 0);
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
}
