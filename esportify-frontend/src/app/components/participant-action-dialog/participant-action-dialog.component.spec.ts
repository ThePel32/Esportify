import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantActionDialogComponent } from './participant-action-dialog.component';

describe('ParticipantActionDialogComponent', () => {
  let component: ParticipantActionDialogComponent;
  let fixture: ComponentFixture<ParticipantActionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantActionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantActionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
