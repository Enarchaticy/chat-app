import { OverlayModule } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { AuthorizeRoomDialogComponent } from './authorize-room-dialog.component';

describe('AuthorizeRoomDialogComponent', () => {
  let component: AuthorizeRoomDialogComponent;
  let fixture: ComponentFixture<AuthorizeRoomDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthorizeRoomDialogComponent],
      imports: [
        OverlayModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizeRoomDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send password through passwordSubject after submit', () => {
    component.resetForm();
    const closeDialog = spyOn((component as any).dialogService, 'closeDialog');
    const passwordSubject = spyOn(
      (component as any).roomService.passwordSubject,
      'next'
    );
    component.passwordForm.value.password = 'asdasd';
    component.submit();

    expect(closeDialog).toHaveBeenCalledTimes(1);
    expect(passwordSubject).toHaveBeenCalledWith('asdasd');
  });
});
