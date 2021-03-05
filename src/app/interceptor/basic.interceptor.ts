import { Visibility, Room } from './../interfaces/room';
import { users, User } from './../interfaces/user';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpParams,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { rooms } from '../interfaces/room';

@Injectable()
export class BasicInterceptor implements HttpInterceptor {
  constructor() {}

  queryByRequestType(params: HttpParams): Observable<HttpEvent<unknown>> {
    if (params.get('type') === 'direct') {
      return of(
        new HttpResponse({
          status: 200,
          body: rooms.find(
            (room: Room) =>
              room.visibility === Visibility.private &&
              room.members.some((member) => member.id === params.get('myId')) &&
              room.members.some(
                (member) => member.id === params.get('friendId')
              ) &&
              room.members.length === 2
          ),
        })
      );
    }

    if (params.get('type') === 'visible') {
      return of(
        new HttpResponse({
          status: 200,
          body: rooms.filter(
            (room) =>
              room.visibility === Visibility.public ||
              room.visibility === Visibility.protected ||
              (room.visibility === Visibility.private &&
                room.members.some(
                  (member) => member.id === params.get('userId')
                ) &&
                room.members.length > 2)
          ),
        })
      );
    }
    if (params.get('type') === 'private') {
      return of(
        new HttpResponse({
          status: 200,
          body: rooms.find(
            (room) =>
              room.id === params.get('id') &&
              room.members.some((member) => member.id === params.get('userId'))
          ),
        })
      );
    }
    if (params.get('type') === 'protected') {
      const authorizedRoom = rooms.find(
        (room) =>
          room.id === params.get('id') &&
          room.password === params.get('password')
      );
      if (authorizedRoom) {
        return of(
          new HttpResponse({
            status: 200,
            body: authorizedRoom,
          })
        );
      } else {
        return of(
          new HttpResponse({
            status: 401,
            body: { message: 'Not authorized!' },
          })
        );
      }
    }
    if (params.get('type') === 'public') {
      return of(
        new HttpResponse({
          status: 200,
          body: rooms.find((room) => room.id === params.get('id')),
        })
      );
    }
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.method === 'GET' && request.url === 'user') {
      return of(
        new HttpResponse({
          status: 200,
          body: users.find((user) => user.id === request.params.get('id')),
        })
      );
    }

    if (request.method === 'GET' && request.url === 'user/online') {
      return of(
        new HttpResponse({
          status: 200,
          body: users.filter(
            (user) => user.isOnline && user.id !== request.params.get('id')
          ),
        })
      );
    }

    if (request.method === 'POST' && request.url === 'user/auth') {
      const authUser = users.find(
        (user) =>
          user.email === request.params.get('email') &&
          user.password === request.params.get('password')
      );
      if (authUser) {
        return of(
          new HttpResponse({
            status: 200,
            body: authUser,
          })
        );
      } else {
        return of(
          new HttpResponse({
            status: 401,
            body: { message: 'Bad username and password' },
          })
        );
      }
    }

    /* if (request.method === 'POST' && request.url === 'user/auth') {
      return of(
        new HttpResponse({
          status: 200,
          body: users.find(
            (user) =>
              user.email === request.params.get('email') &&
              user.password === request.params.get('password')
          ),
        })
      );
    } */

    if (request.method === 'POST' && request.url === 'user') {
      users.push(request.body as User);
      return of(
        new HttpResponse({
          status: 201,
          body: { message: 'Successful registration' },
        })
      );
    }

    if (request.method === 'POST' && request.url === 'room') {
      rooms.push({ ...(request.body as Room), id: 'd' });
      return of(
        new HttpResponse({
          status: 201,
          body: { message: 'Successful room registration', roomId: 'd' },
        })
      );
    }

    if (request.method === 'GET' && request.url === 'room') {
      return this.queryByRequestType(request.params);
    }
    return next.handle(request);
  }
}
