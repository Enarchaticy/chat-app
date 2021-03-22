import { Room } from './../../interfaces/room';
import { Injectable } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private overlayRef: OverlayRef;
  private dataSubject: Subject<
    string | boolean | Room
  > = new Subject();
  public dataSubject$: Observable<string | boolean | Room> = this.dataSubject.asObservable();

  constructor(private overlay: Overlay) {}

  public openDialog<T>(componentPortal: ComponentPortal<T>): void {
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
    this.overlayRef.backdropClick().subscribe(() => {
      this.closeDialog('Canceled dialog');
    });
  }

  public closeDialog(data?: string | Room): void {
    if (data) {
      this.dataSubject.next(data);
    }
    this.overlayRef.dispose();
  }
}
