import { Room } from './../interfaces/room';
import { DialogService } from './dialogs/dialog.service';
import { CreateRoomDialogComponent } from './dialogs/create-room-dialog/create-room-dialog.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { User } from './../interfaces/user';
import { RoomService } from './../services/room.service';
import { UserService } from './../services/user.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay, tap, first, take } from 'rxjs/operators';
import { Visibility } from '../interfaces/room';

@Component({
  selector: 'app-navigation',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  onlineUsers$: Observable<unknown>;
  visibleRooms$: Observable<unknown>;

  roomInput: Room = { name: 'me', id: 'me', visibility: Visibility.public };
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

  setDefaultRoom(): void {
    this.roomInput = { id: 'me', visibility: Visibility.public };
  }

  openCreateRoomDialog(): void {
    const containerPortal = new ComponentPortal(CreateRoomDialogComponent);
    this.dialogService.openDialog<CreateRoomDialogComponent>(containerPortal);
    this.getCreatedRoom();
  }

  getOnlineUsers(): void {
    this.onlineUsers$ = this.userService.getOnline(localStorage.getItem('id'));
  }

  getVisibleRooms(): void {
    this.visibleRooms$ = this.roomService
      .getVisible(localStorage.getItem('id'))
      .pipe(tap((res: Room[]) => (this.rooms = res)));
  }

  getDirectMessages(friend: User): void {
    this.roomService
      .getDirectMessages(localStorage.getItem('id'), friend.id)
      .pipe(first())
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
    this.roomService
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
      .pipe(first())
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

  logout() {
    const token = JSON.parse(localStorage.getItem('user'));
    this.userService
      .logout()
      .pipe(first())
      .subscribe((res) => {
        const user: User = {
          name: token.displayName,
          email: token.email,
          isOnline: false,
        };
        this.userService
          .createOrUpdateUser(token.uid, user)
          .pipe(first())
          .subscribe();
        localStorage.clear();
        this.router.navigate(['/auth']);
      });
  }

  getCreatedRoom(): void {
    this.dialogService.dataSubject$.pipe(take(2)).subscribe((room: any) => {
      if (room && room.id) {
        this.rooms.push(room);
        this.roomInput = room;
        this.router.navigate(['room']);
      }
    });
  }
}
