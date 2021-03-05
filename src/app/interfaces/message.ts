import { User } from './user';

export interface Message {
    date: Date;
    text: string;
    author: User;
}
