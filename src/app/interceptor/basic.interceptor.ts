import { UserService } from './../services/user.service';
import { Message } from './../interfaces/message';
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
  constructor(private userService: UserService) {}

  directMessages(params: HttpParams): Observable<HttpEvent<unknown>> {
    return this.response(
      200,
      rooms.find(
        (room: Room) =>
          room.visibility === Visibility.private &&
          room.members.some((member) => member.id === params.get('myId')) &&
          room.members.some((member) => member.id === params.get('friendId')) &&
          room.members.length === 2
      )
    );
  }

  getVisible(params: HttpParams): Observable<HttpEvent<unknown>> {
    return this.response(
      200,
      rooms.filter(
        (room) =>
          room.visibility === Visibility.public ||
          room.visibility === Visibility.protected ||
          (room.visibility === Visibility.private &&
            room.members.some((member) => member.id === params.get('userId')) &&
            room.members.length > 2)
      )
    );
  }

  getPrivate(params: HttpParams): Observable<HttpEvent<unknown>> {
    return this.response(
      200,
      rooms.find(
        (room) =>
          room.id === params.get('id') &&
          room.members.some((member) => member.id === params.get('userId'))
      )
    );
  }

  getProtected(params: HttpParams): Observable<HttpEvent<unknown>> {
    const authorizedRoom = rooms.find(
      (room) =>
        room.id === params.get('id') && room.password === params.get('password')
    );
    if (authorizedRoom) {
      return this.response(200, authorizedRoom);
    } else {
      return this.response(401, { message: 'Not authorized!' });
    }
  }

  getPublic(params: HttpParams): Observable<HttpEvent<unknown>> {
    return this.response(
      200,
      rooms.find((room) => room.id === params.get('id'))
    );
  }

  queryByRequestType(params: HttpParams): Observable<HttpEvent<unknown>> {
    switch (params.get('type')) {
      case 'direct':
        return this.directMessages(params);
      case 'visible':
        return this.getVisible(params);
      case 'private':
        return this.getPrivate(params);
      case 'protected':
        return this.getProtected(params);
      case 'public':
        return this.getPublic(params);
    }
  }

  getByIdOrEmail(params: HttpParams): Observable<HttpEvent<unknown>> {
    return this.response(
      200,
      users.find(
        (user) =>
          user.id === params.get('id') || user.email === params.get('id')
      )
    );
  }

  getOnlineUsers(params: HttpParams): Observable<HttpEvent<unknown>> {
    return this.response(
      200,
      users.filter((user) => user.isOnline && user.id !== params.get('id'))
    );
  }

  userLogin(): Observable<HttpEvent<unknown>> {
    let authUser: User;
    if (this.userService.isLoggedIn) {
      authUser = users.find(
        (user) => user.email === JSON.parse(localStorage.getItem('user')).email
      );
      if (authUser) {
        return this.response(200, authUser);
      } else {
        this.createUserForThirdPartyAuth();
        return this.response(200, users[users.length - 1]);
      }
    }
    return this.response(400, 'Bad request!');
  }

  createUserForThirdPartyAuth(): void {
    users.push({
      id: Math.floor(Math.random() * 10000) + '',
      email: JSON.parse(localStorage.getItem('user')).email,
      name: JSON.parse(localStorage.getItem('user')).displayName,
      isOnline: true,
    });
  }

  createUser(userToCreate: User): Observable<HttpEvent<unknown>> {
    if (users.find((user) => user.email === userToCreate.email)) {
      return this.response(404, { message: 'Email is reserved!' });
    } else {
      users.push({
        id: Math.floor(Math.random() * 10000) + '',
        ...userToCreate,
      });
      return this.response(201, { message: 'Successful registration' });
    }
  }

  sendMessage(
    params: HttpParams,
    message: Message
  ): Observable<HttpEvent<unknown>> {
    const room1: Room = rooms.find(
      (room: Room) => room.id === params.get('id')
    );
    if (room1) {
      room1.messages.push(message);
    }
    return this.response(
      200,
      room1
        ? { message: 'Message sent successfully' }
        : { message: 'Something went wrong!' }
    );
  }

  createRoom(room: Room): Observable<HttpEvent<unknown>> {
    rooms.push({
      ...room,
      id: Math.floor(Math.random() * 10000) + '',
      messages: [],
    });
    return this.response(201, {
      message: 'Successful room registration',
      room: rooms[rooms.length - 1],
    });
  }

  // kérés típus és url alapján a megfelelő választ adja vissza a mockolt adatokból
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.method === 'GET' && request.url === 'user') {
      return this.getByIdOrEmail(request.params);
    } else if (request.method === 'GET' && request.url === 'user/online') {
      return this.getOnlineUsers(request.params);
    } else if (request.method === 'POST' && request.url === 'user/auth') {
      return this.userLogin();
    } else if (request.method === 'POST' && request.url === 'user') {
      return this.createUser(request.body as User);
    } else if (request.method === 'PUT' && request.url === 'room') {
      return this.sendMessage(request.params, request.body as Message);
    } else if (request.method === 'POST' && request.url === 'room') {
      return this.createRoom(request.body as Room);
    } else if (request.method === 'GET' && request.url === 'room') {
      return this.queryByRequestType(request.params);
    }

    return next.handle(request);
  }

  response(status: number, body: any): Observable<HttpEvent<unknown>> {
    return of(
      new HttpResponse({
        status,
        body,
      })
    );
  }
}
