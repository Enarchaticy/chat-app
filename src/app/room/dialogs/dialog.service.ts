import { Room } from './../../interfaces/room';
import { Injectable } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private overlayRef: OverlayRef;
  public dataSubject: BehaviorSubject<
    string | boolean | Room
  > = new BehaviorSubject(false);

  constructor(private overlay: Overlay) {}

  public openAuthorizeRoomDialog<T>(componentPortal: ComponentPortal<T>): void {
    this.dataSubject.next(false);
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
    this.overlayRef
      .backdropClick()
      .subscribe(() => this.closeDialog('Password is not entered'));
  }

  public openCreateRoomDialog<T>(componentPortal: ComponentPortal<T>): void {
    this.overlayRef = this.overlay.create({
      width: 279,
      height: 300,
      hasBackdrop: true,
      positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
    });
    this.overlayRef.attach(componentPortal);
    this.overlayRef.backdropClick().subscribe(() => this.closeDialog());
  }

  public closeDialog(data?: string | Room): void {
    if (data) {
      this.dataSubject.next(data);
    }
    this.overlayRef.dispose();
  }
}
