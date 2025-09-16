import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreEntryDialogComponent } from './score-entry-dialog.component';

describe('ScoreEntryDialogComponent', () => {
  let component: ScoreEntryDialogComponent;
  let fixture: ComponentFixture<ScoreEntryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreEntryDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoreEntryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
