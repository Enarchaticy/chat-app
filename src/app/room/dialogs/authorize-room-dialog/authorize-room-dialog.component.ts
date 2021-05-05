import { RoomService } from './../../../services/room.service';
import { DialogService } from './../dialog.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AddPassword } from '../../store/password.actions';
@Component({
  selector: 'app-authorize-room-dialog',
  templateUrl: './authorize-room-dialog.component.html',
  styleUrls: ['./authorize-room-dialog.component.scss'],
})
export class AuthorizeRoomDialogComponent implements OnInit {
  passwordForm: FormGroup;

  constructor(
    public dialogService: DialogService,
    private roomService: RoomService,
    private store: Store<{ password: string }>
  ) {}

  ngOnInit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.passwordForm = new FormGroup({
      password: new FormControl('', Validators.required),
    });
  }

  submit(): void {
    /* this.roomService.password = this.passwordForm.value.password; */
    /* console.log(this.passwordForm.value.password); */
    this.store.dispatch(new AddPassword(this.passwordForm.value.password));
    this.dialogService.closeDialog();
  }
}
