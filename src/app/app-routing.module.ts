import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'room/:id',
    loadChildren: () => import('./room/room.module').then((m) => m.RoomModule),
  },
  { path: '**', redirectTo: '/room/me', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
