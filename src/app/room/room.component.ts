import { Room } from './../interfaces/room';
import { DialogService } from './dialogs/dialog.service';
import { CreateRoomDialogComponent } from './dialogs/create-room-dialog/create-room-dialog.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { User } from './../interfaces/user';
import { RoomService } from './../services/room.service';
import { UserService } from './../services/user.service';
import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Visibility } from '../interfaces/room';

@Component({
  selector: 'app-navigation',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit, OnDestroy {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  routerSubs: Subscription;
  userSubs: Subscription;
  visibleRoomsSubs: Subscription;
  openedRoomSubs: Subscription;
  directMessagesSubs: Subscription;
  createRoomSubs: Subscription;
  createdRoomSubs: Subscription;

  roomInput: Room = { name: 'me', id: 'me', visibility: Visibility.public };
  onlineUsers: User[] = [];
  rooms: Room[];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private userService: UserService,
    private roomService: RoomService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.getOnlineUsers();
    this.getVisibleRooms();
  }

  ngOnDestroy(): void {
    if (this.routerSubs) {
      this.routerSubs.unsubscribe();
    }
    if (this.userSubs) {
      this.userSubs.unsubscribe();
    }
    if (this.visibleRoomsSubs) {
      this.visibleRoomsSubs.unsubscribe();
    }
    if (this.openedRoomSubs) {
      this.openedRoomSubs.unsubscribe();
    }
    if (this.directMessagesSubs) {
      this.directMessagesSubs.unsubscribe();
    }
    if (this.createRoomSubs) {
      this.createRoomSubs.unsubscribe();
    }
  }

  setDefaultRoom(): void {
    this.roomInput = { id: 'me', visibility: Visibility.public };
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/auth']);
  }

  openCreateRoomDialog(): void {
    const containerPortal = new ComponentPortal(CreateRoomDialogComponent);
    this.dialogService.openDialog<CreateRoomDialogComponent>(containerPortal);
    this.getCreatedRoom();
  }

  getOnlineUsers(): void {
    this.userSubs = this.userService
      .getOnline(localStorage.getItem('id'))
      .subscribe(
        (result: User[]) => {
          this.onlineUsers = result;
        },
        (error) => {
          console.error(error);
        }
      );
  }

  getVisibleRooms(): void {
    this.visibleRoomsSubs = this.roomService
      .getVisible(localStorage.getItem('id'))
      .subscribe(
        (result: Room[]) => {
          this.rooms = result;
        },
        (error) => {
          console.error(error);
        }
      );
  }

  getDirectMessages(friend: User): void {
    this.directMessagesSubs = this.roomService
      .getDirectMessages(localStorage.getItem('id'), friend.id)
      .subscribe(
        (result: Room) => {
          if (result) {
            this.roomInput = result;
            this.router.navigate(['/room']);
          } else {
            this.createRoomForDirectMessages(friend);
          }
        },
        (error) => {
          console.error(error);
        }
      );
  }

  createRoomForDirectMessages(friend: User): void {
    this.createRoomSubs = this.roomService
      .create({
        visibility: Visibility.private,
        messages: [],
        members: [
          friend,
          {
            id: localStorage.getItem('id'),
            name: localStorage.getItem('name'),
          },
        ],
      })
      .subscribe(
        (result: any) => {
          this.roomInput = result.room;
          this.router.navigate(['/room']);
        },
        (error) => {
          console.error(error);
        }
      );
  }

  getCreatedRoom(): void {
    this.createdRoomSubs = this.dialogService.dataSubject.subscribe(
      (room: any) => {
        console.log(room);
        if (room && room.id) {
          this.rooms.push(room);
          this.roomInput = room;
          this.router.navigate(['room']);
        }
        if (this.createdRoomSubs) {
          this.createdRoomSubs.unsubscribe();
        }
      }
    );
  }
}
