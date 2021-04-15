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
import { combineLatest, Observable } from 'rxjs';
import { map, shareReplay, first } from 'rxjs/operators';

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

  onlineUsers$: Observable<User[]>;
  visibleRooms$: Observable<Room[]>;

  userForDirectMessage: User;
  roomToOpen: Room;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private userService: UserService,
    private roomService: RoomService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.observeOnlineUsers();
    this.observeVisibleRooms();
  }

  openCreateRoomDialog(): void {
    const containerPortal = new ComponentPortal(CreateRoomDialogComponent);
    this.dialogService.openDialog<CreateRoomDialogComponent>(containerPortal);
  }

  logout() {
    this.userService
      .logout()
      .pipe(first())
      .subscribe(() => {
        this.userService
          .updateIsOnline(JSON.parse(localStorage.getItem('user')).uid, false)
          .pipe(first())
          .subscribe();
        localStorage.clear();
        this.router.navigate(['/auth']);
      });
  }

  private observeOnlineUsers(): void {
    this.onlineUsers$ = this.userService.getOnline();
  }

  private observeVisibleRooms() {
    this.visibleRooms$ = combineLatest([
      this.roomService.getAllPrivate(),
      this.roomService.getAll(),
    ]).pipe(
      map(([privateRooms, otherRooms]) => [...privateRooms, ...otherRooms])
    );
  }
}
