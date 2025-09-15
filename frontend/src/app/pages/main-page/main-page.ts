import { Component } from '@angular/core';
import { ArtifactsTable } from '../../components/artifacts-table/artifacts-table';

@Component({
  selector: 'app-main-page',
  imports: [ArtifactsTable],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
})
export class MainPage {}
