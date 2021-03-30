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
import { map, shareReplay, tap, first } from 'rxjs/operators';

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

  userForDirectMessage: User;
  roomToOpen: Room;
  private rooms: Room[];

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

  openCreateRoomDialog(): void {
    const containerPortal = new ComponentPortal(CreateRoomDialogComponent);
    this.dialogService
      .openDialog<CreateRoomDialogComponent>(containerPortal)
      .subscribe({
        complete: () => {
          const room = this.roomService.newRoom;
          if (room && room.id !== this.rooms[this.rooms.length - 1].id) {
            this.rooms.push(room);
            this.roomToOpen = room;
          }
        },
      });
  }

  logout() {
    const token = JSON.parse(localStorage.getItem('user'));
    this.userService
      .logout()
      .pipe(first())
      .subscribe(() => {
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

  private getOnlineUsers(): void {
    this.onlineUsers$ = this.userService.getOnline(localStorage.getItem('id'));
  }

  private getVisibleRooms(): void {
    this.visibleRooms$ = this.roomService
      .getVisible(localStorage.getItem('id'))
      .pipe(tap((res: Room[]) => (this.rooms = res)));
  }
}
