import { MatSnackBarModule } from '@angular/material/snack-bar';
import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { appReducerMap } from './room/store/app.reducer';
import { EffectsModule } from '@ngrx/effects';
import { DirectMessagesEffects } from './room/store/direct-messages.effects';
import { PasswordEffect } from './room/store/password.effects';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    BrowserAnimationsModule,
    HttpClientModule,
    OverlayModule,
    MatSelectModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    StoreModule.forRoot(appReducerMap),
    EffectsModule.forRoot([DirectMessagesEffects, PasswordEffect]),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    AngularFireDatabaseModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
