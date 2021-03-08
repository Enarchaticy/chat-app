import { User } from './user';
import { Message } from './message';

export enum Visibility {
  private = 'private',
  protected = 'protected',
  public = 'public',
}

export interface Room {
  id?: string;
  name?: string;
  visibility?: Visibility;
  password?: string;
  members?: User[];
  messages?: Message[];
}

export const rooms: Room[] = [
  {
    id: 'a',
    // name: 'asd',
    visibility: Visibility.private,
    members: [
      { id: '1', name: 'adam' },
      { id: '2', name: 'peti' },
    ],
    messages: [
      {
        text: 'helló',
        date: new Date('2021-03-02T08:58:02.177Z'),
        author: { id: '1', name: 'adam' },
      },
      {
        text: 'helló',
        date: new Date('2021-03-02T08:58:05.177Z'),
        author: { id: '2', name: 'peti' },
      },
      {
        text: 'mi újság?',
        date: new Date('2021-03-02T08:58:20.177Z'),
        author: { id: '1', name: 'adam' },
      },
      {
        text: 'semmi különös, veled?',
        date: new Date('2021-03-02T08:58:30.177Z'),
        author: { id: '2', name: 'peti' },
      },
      {
        text: 'semmi',
        date: new Date('2021-03-02T08:59:02.177Z'),
        author: { id: '1', name: 'adam' },
      },
    ],
  },
  {
    id: 'b',
    name: 'edzés',
    visibility: Visibility.protected,
    password: 'string',
    messages: [
      {
        text: 'helló',
        date: new Date('2021-03-02T08:58:02.177Z'),
        author: { id: '1', name: 'adam' },
      },
      {
        text: 'helló',
        date: new Date('2021-03-02T08:58:05.177Z'),
        author: { id: '2', name: 'peti' },
      },
      {
        text: 'helló',
        date: new Date('2021-03-02T08:58:10.177Z'),
        author: { id: '3', name: 'rita' },
      },
      {
        text: 'ma edzés?',
        date: new Date('2021-03-02T08:58:15.177Z'),
        author: { id: '2', name: 'peti' },
      },
      {
        text: 'én nem érek rá',
        date: new Date('2021-03-02T08:58:25.177Z'),
        author: { id: '1', name: 'adam' },
      },
      {
        text: 'esetleg holnap?',
        date: new Date('2021-03-02T08:58:30.177Z'),
        author: { id: '1', name: 'adam' },
      },
      {
        text: 'nekem holnap nem jó',
        date: new Date('2021-03-02T08:58:40.177Z'),
        author: { id: '2', name: 'peti' },
      },
      {
        text: 'nekem mind a kettő nap jó',
        date: new Date('2021-03-02T08:59:40.177Z'),
        author: { id: '3', name: 'rita' },
      },
      {
        text: 'ma akkor 5kor?',
        date: new Date('2021-03-02T08:59:43.177Z'),
        author: { id: '3', name: 'rita' },
      },
      {
        text: 'oké',
        date: new Date('2021-03-02T08:59:55.177Z'),
        author: { id: '2', name: 'peti' },
      },
    ],
  },
  {
    id: 'c',
    name: 'buli',
    visibility: Visibility.public,
    messages: [
      {
        text: 'helló',
        date: new Date('2021-03-02T08:58:02.177Z'),
        author: { id: '1', name: 'adam' },
      },
      {
        text: 'helló',
        date: new Date('2021-03-02T08:58:05.177Z'),
        author: { id: '2', name: 'peti' },
      },
      {
        text: 'helló',
        date: new Date('2021-03-02T08:58:10.177Z'),
        author: { id: '3', name: 'rita' },
      },
      {
        text: 'buli 8ra?',
        date: new Date('2021-03-03T08:58:12.177Z'),
        author: { id: '1', name: 'adam' },
      },
      {
        text: 'mehet',
        date: new Date('2021-03-03T08:58:15.177Z'),
        author: { id: '2', name: 'peti' },
      },
      {
        text: 'mehet',
        date: new Date('2021-03-03T08:58:18.177Z'),
        author: { id: '3', name: 'rita' },
      },
    ],
  },
];
