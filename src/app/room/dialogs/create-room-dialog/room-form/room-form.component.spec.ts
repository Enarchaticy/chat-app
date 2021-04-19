import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { Visibility } from 'src/app/interfaces/room';
import { MOCK_AUTH_USER, setStorageUser } from 'src/app/interfaces/user';
import { RoomFormComponent } from './room-form.component';

describe('RoomFormComponent', () => {
  let component: RoomFormComponent;
  let fixture: ComponentFixture<RoomFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoomFormComponent],
      imports: [ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomFormComponent);
    component = fixture.componentInstance;
    setStorageUser();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should resetForm by visibility', () => {
    component.resetForm(new MatSelectChange({} as any, Visibility.public));
    expect(component.visibility).toBe(Visibility.public);
    expect(component.createRoomForm.value).toEqual({ name: '' });

    component.resetForm(new MatSelectChange({} as any, Visibility.protected));
    expect(component.visibility).toBe(Visibility.protected);
    expect(component.createRoomForm.value).toEqual({ name: '', password: '' });

    component.resetForm(new MatSelectChange({} as any, Visibility.private));
    expect(component.visibility).toBe(Visibility.private);
    expect(component.createRoomForm.value).toEqual({
      name: '',
      members: [{ id: MOCK_AUTH_USER.uid }],
    });
  });

  it('should add item to FormArray with addMember', () => {
    component.resetForm(new MatSelectChange({} as any, Visibility.private));
    expect(component.createRoomForm.value).toEqual({
      name: '',
      members: [{ id: MOCK_AUTH_USER.uid }],
    });
    component.addMember();
    expect(component.createRoomForm.value).toEqual({
      name: '',
      members: [{ id: MOCK_AUTH_USER.uid }, { id: '' }],
    });
  });

  it('should remove member from form array', () => {
    component.resetForm(new MatSelectChange({} as any, Visibility.private));
    component.addMember();
    expect(component.createRoomForm.value).toEqual({
      name: '',
      members: [{ id: MOCK_AUTH_USER.uid }, { id: '' }],
    });
    component.removeMember(1);
    expect(component.createRoomForm.value).toEqual({
      name: '',
      members: [{ id: MOCK_AUTH_USER.uid }],
    });
    component.removeMember(0);
    expect(component.createRoomForm.value).toEqual({ name: '', members: [] });
  });

  it('should submit trigger roomSubmit with the room value', () => {
    const roomSubmit = spyOn((component as any).roomSubmit, 'emit');
    component.resetForm(new MatSelectChange({} as any, Visibility.public));
    component.submit();
    expect(roomSubmit).toHaveBeenCalledTimes(1);
    expect(roomSubmit).toHaveBeenCalledWith({
      name: '',
      visibility: Visibility.public,
    });
  });

  it('should get members return form array, and its value should be ids', () => {
    component.resetForm(new MatSelectChange({} as any, Visibility.private));
    expect(component.members.value).toEqual([{id: MOCK_AUTH_USER.uid}]);
  });
});
