import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
import { DialogService } from '../dialog.service';

import { AuthorizeRoomDialogComponent } from './authorize-room-dialog.component';

describe('AuthorizeRoomDialogComponent', () => {
  let component: AuthorizeRoomDialogComponent;
  let fixture: ComponentFixture<AuthorizeRoomDialogComponent>;
  let dialogService: jasmine.SpyObj<DialogService>;

  beforeEach(async () => {
    dialogService = jasmine.createSpyObj<DialogService>('DialogService', {
      closeDialog: null,
    });

    await TestBed.configureTestingModule({
      declarations: [AuthorizeRoomDialogComponent],
      imports: [
        OverlayModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        CommonModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
      providers: [{ provide: DialogService, useValue: dialogService }],
      schemas: [NO_ERRORS_SCHEMA],
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
    component.passwordForm.value.password = 'testPassword';
    component.submit();
    expect(dialogService.closeDialog).toHaveBeenCalledTimes(1);
  });
});
