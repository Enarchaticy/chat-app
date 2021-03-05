import { DialogService } from './../dialog.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-authorize-room-dialog',
  templateUrl: './authorize-room-dialog.component.html',
  styleUrls: ['./authorize-room-dialog.component.scss'],
})
export class AuthorizeRoomDialogComponent implements OnInit {
  passwordForm: FormGroup;

  constructor(public dialogService: DialogService) {}

  ngOnInit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.passwordForm = new FormGroup({
      password: new FormControl('', Validators.required),
    });
  }

  submit(): void {
    this.dialogService.closeDialog(this.passwordForm.value.password);
  }
}
