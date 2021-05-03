import { Overlay, OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthorizeRoomDialogComponent } from './authorize-room-dialog/authorize-room-dialog.component';
import { DialogService } from './dialog.service';

describe('DialogService', () => {
  let service: DialogService;
  let overlay: jasmine.SpyObj<any>;
  let overlayRef: jasmine.SpyObj<any>;

  beforeEach(() => {
    overlay = jasmine.createSpyObj<Overlay>('Overlay', ['position', 'create']);

    overlay.position.and.returnValue(
      jasmine.createSpyObj('position', ['global'])
    );
    overlay
      .position()
      .global.and.returnValue(
        jasmine.createSpyObj('global', ['centerHorizontally'])
      );
    overlay
      .position()
      .global()
      .centerHorizontally.and.returnValue(
        jasmine.createSpyObj('centerHorizontally', ['centerVertically'])
      );

    overlay.scrollStrategies = {
      block: () => undefined,
    };
    overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically.and.returnValue(undefined);

    overlayRef = jasmine.createSpyObj<OverlayRef>('OverlayRef', [
      'attach',
      'backdropClick',
      'dispose',
    ]);
    overlayRef.attach.and.returnValue(undefined);
    overlayRef.backdropClick.and.returnValue(of(undefined));
    overlayRef.dispose.and.returnValue(undefined);

    overlay.create.and.returnValue(overlayRef);

    TestBed.configureTestingModule({
      imports: [
        OverlayModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
      ],
      providers: [{ provide: Overlay, useValue: overlay }],
      schemas: [NO_ERRORS_SCHEMA],
    });
    service = TestBed.inject(DialogService);
    overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically.calls.reset();
    overlay.position().global().centerHorizontally.calls.reset();
    overlay.position().global.calls.reset();
    overlay.position.calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should openDialog create an overlay', () => {
    const containerPortal = new ComponentPortal(AuthorizeRoomDialogComponent);
    service.openDialog(containerPortal);
    expect(overlay.create).toHaveBeenCalledTimes(1);
    expect(overlay.position).toHaveBeenCalledTimes(1);
    expect(overlay.position().global).toHaveBeenCalledTimes(1);
    expect(
      overlay.position().global().centerHorizontally
    ).toHaveBeenCalledTimes(1);
    expect(
      overlay.position().global().centerHorizontally().centerVertically
    ).toHaveBeenCalledTimes(1);

    expect(overlayRef.attach).toHaveBeenCalledTimes(1);
    expect(overlayRef.backdropClick).toHaveBeenCalledTimes(1);
  });
});
