import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtifactsTable } from './artifacts-table';

describe('ArtifactsTable', () => {
  let component: ArtifactsTable;
  let fixture: ComponentFixture<ArtifactsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtifactsTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtifactsTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
