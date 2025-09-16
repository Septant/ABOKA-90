import { Component, inject, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Artifact } from '../../../meta/artifact.meta';
import { DatePipe, NgStyle } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
} from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { DataService } from '../../services/data.service';
import { ReportViewMode } from '../../../meta/report-view-mode.type';

@Component({
  selector: 'app-report-dialog',
  imports: [
    MatIcon,
    MatDialogClose,
    DatePipe,
    ReactiveFormsModule,
    MatInput,
    MatFormField,
    MatLabel,
    MatButton,
    MatError,
    NgStyle,
  ],
  templateUrl: './report-dialog.html',
  styleUrl: './report-dialog.scss',
})
export class ReportDialog {
  private dataService = inject(DataService);
  private dialogRef = inject(MatDialogRef<ReportDialog>);

  reportForm = new FormGroup({
    report: new FormControl<string>('', [Validators.required]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { mode: ReportViewMode; artifact: Artifact }
  ) {
    if (data.artifact.report)
      this.reportForm.get('report')?.setValue(data.artifact.report);
  }

  updateReport() {
    if (this.reportForm.valid) {
      this.dataService
        .updateArtifactReport(
          this.data.artifact.idx!,
          this.reportForm!.get('report')!.value!
        )
        .then(() => this.dialogRef.close('success'));
    }
  }
}
