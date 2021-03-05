import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizeRoomDialogComponent } from './authorize-room-dialog.component';

describe('AuthorizeRoomDialogComponent', () => {
  let component: AuthorizeRoomDialogComponent;
  let fixture: ComponentFixture<AuthorizeRoomDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorizeRoomDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizeRoomDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
