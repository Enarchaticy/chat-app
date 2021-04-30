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
  let overlayService;
  let overlayRef: jasmine.SpyObj<OverlayRef>;

  beforeEach(() => {
    /*  overlay = jasmine.createSpyObj<Overlay>('Overlay', ['position', 'create']);

    overlay.position.and.returnValue(
      jasmine.createSpyObj('position', ['global'])
    );
    overlay.position().global.and.returnValue('global', ['centerHorizontally']);
    overlay
      .position()
      .global()
      .centerHorizontally.and.returnValue('centerHorizontally', [
        'centerVertically',
      ]);
    overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically.and.returnValue(undefined); */
    /* () => {
      global: () =>
        ({
          centerHorizontally: () => {
            ({ centerVertically: () => undefined } as any);
          },
        } as any),
    } as any, */

    TestBed.configureTestingModule({
      imports: [
        OverlayModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
      ],
      providers: [
        /*         { provide: OverlayRef, useValue: overlayRef },
         */
        /* { provide: Overlay, useValue: overlay }, */
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    service = TestBed.inject(DialogService);

    /* overlayService = TestBed.get(Overlay); */

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

 /*  it('should openDialog call overlay create', () => {
    const containerPortal = new ComponentPortal(AuthorizeRoomDialogComponent);
    service.openDialog(containerPortal);
    const spyOnCreate = spyOn(overlayService, 'create');
    const spyOnPosition =spyOn(overlayService, 'position');

    expect(spyOnCreate).toHaveBeenCalledTimes(1);
    expect(spyOnPosition).toHaveBeenCalledTimes(1);
  }); */

  /* it('should open a dialog', () => {
    const containerPortal = new ComponentPortal(AuthorizeRoomDialogComponent);
    service.openDialog(containerPortal);
    const asd = spyOn((service as any).overlayRef, 'attach');
    expect(asd).toHaveBeenCalledTimes(1);
    expect(overlayRef.backdropClick).toHaveBeenCalledTimes(1);
  }); */
});
