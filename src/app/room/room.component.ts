import { Room } from './../interfaces/room';
import { DialogService } from './dialogs/dialog.service';
import { CreateRoomDialogComponent } from './dialogs/create-room-dialog/create-room-dialog.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { User } from './../interfaces/user';
import { RoomService } from './../services/room.service';
import { UserService } from './../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
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

  userId = '1';
  userName = 'adam';

  roomId: string;
  roomInput: Room = { name: 'me', id: 'me', visibility: Visibility.public };
  onlineUsers: User[] = [];
  rooms: Room[];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private roomService: RoomService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.getRouterId();
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

  openCreateRoomDialog(): void {
    const containerPortal = new ComponentPortal(
      CreateRoomDialogComponent,
      null
    );
    this.dialogService.openAuthorizeRoomDialog<CreateRoomDialogComponent>(
      containerPortal
    );
  }

  getRouterId(): void {
    this.routerSubs = this.route.params.subscribe((params) => {
      this.roomId = params.id;
      if (params.id === 'me' && this.roomInput.id !== 'me') {
        this.roomInput = {
          name: 'me',
          id: 'me',
          visibility: Visibility.public,
        };
      }
    });
  }

  getOnlineUsers(): void {
    this.userSubs = this.userService.getOnline(this.userId).subscribe(
      (result: User[]) => {
        this.onlineUsers = result;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getVisibleRooms(): void {
    this.visibleRoomsSubs = this.roomService.getVisible(this.userId).subscribe(
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
      .getDirectMessages(this.userId, friend.id)
      .subscribe(
        (result: Room) => {
          if (result) {
            this.roomInput = result;
            this.router.navigate(['/room', result.id]);
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
        members: [friend, { id: this.userId, name: this.userName }],
      })
      .subscribe(
        (result: any) => {
          this.roomInput = {
            id: result.roomId,
            visibility: Visibility.private,
          };
          this.router.navigate(['/room', this.roomInput.id]);
        },
        (error) => {
          console.error(error);
        }
      );
  }
}
