import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtifactDialog } from './artifact-dialog';

describe('ArtifactDialog', () => {
  let component: ArtifactDialog;
  let fixture: ComponentFixture<ArtifactDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtifactDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtifactDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
