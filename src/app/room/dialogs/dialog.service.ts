/* eslint-disable @typescript-eslint/member-ordering */
import { Room } from './../../interfaces/room';
import { Injectable } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DialogService {

  private overlayRef: OverlayRef;
  private roomSubject: Subject<Room> = new Subject();
  public roomSubject$: Observable<Room> = this.roomSubject.asObservable();

  private passwordSubject: Subject<string> = new Subject();
  public passwordSubject$: Observable<string> = this.passwordSubject.asObservable();

  private callback = (data?) => void 0;

  constructor(private overlay: Overlay) {}
  public openDialog<T>(componentPortal: ComponentPortal<T>, callback?) {
    this.callback = callback;
    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
    });
    this.overlayRef.attach(componentPortal);
    this.overlayRef.backdropClick().subscribe(() => {
      this.closeDialog(undefined, componentPortal.component.name);
    });
    return {name:'asd'};
  }

  public closeDialog(data: string | Room , componentName: string): void {
    this.callback(data);
    if (componentName === 'CreateRoomDialogComponent') {
      this.roomSubject.next(data as Room);
    } else {
      this.passwordSubject.next(data as string);
    }
    this.overlayRef.dispose();
  }
}
