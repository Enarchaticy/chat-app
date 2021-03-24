import { FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { Visibility, Room } from './../../../../interfaces/room';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-room-form',
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.scss'],
})
export class RoomFormComponent implements OnInit {
  @Output() roomSubmit = new EventEmitter<Room>();
  createRoomForm: FormGroup;

  selectVisibility: Visibility[] = [
    Visibility.public,
    Visibility.protected,
    Visibility.private,
  ];
  visibility: Visibility = Visibility.public;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.resetForm();
  }

  // figyelembe veszi a láthatóságot és aszerint rakja össze a formot, private esetén hozzáadja minket alapértelmezetten a formarrayhoz
  resetForm(event?: any): void {
    if (event) {
      this.visibility = event.value;
    }
    if (this.visibility === Visibility.public) {
      this.createRoomForm = this.fb.group({
        name: ['', Validators.required],
      });
    } else if (this.visibility === Visibility.protected) {
      this.createRoomForm = this.fb.group({
        name: ['', Validators.required],
        password: ['', Validators.required],
      });
    } else {
      this.createRoomForm = this.fb.group({
        name: ['', Validators.required],
        members: this.fb.array([]),
      });
      this.members.push(this.fb.group({ id: [localStorage.getItem('id')] }));
    }
  }

  get members(): FormArray {
    return this.createRoomForm.get('members') as FormArray;
  }

  addMember(): void {
    this.members.push(this.fb.group({ id: [''] }));
  }

  removeMember(i: number): void {
    this.members.removeAt(i);
  }

  submit() {
    this.roomSubmit.emit({
      visibility: this.visibility,
      ...this.createRoomForm.value,
    });
  }
}
