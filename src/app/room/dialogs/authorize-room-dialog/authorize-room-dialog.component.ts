import { DialogService } from './../dialog.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { addPassword } from '../../store/password.actions';
import { AppState } from '../../store/app.reducer';
@Component({
  selector: 'app-authorize-room-dialog',
  templateUrl: './authorize-room-dialog.component.html',
  styleUrls: ['./authorize-room-dialog.component.scss'],
})
export class AuthorizeRoomDialogComponent implements OnInit {
  passwordForm: FormGroup;

  constructor(
    public dialogService: DialogService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.passwordForm = new FormGroup({
      password: new FormControl('', Validators.required),
    });
  }

  submit(): void { // todo a beégetett sztirnget kivenni
    this.store.dispatch(
      addPassword({ id: '2606063721', password: this.passwordForm.value.password })
    );
    this.dialogService.closeDialog();
  }
}
