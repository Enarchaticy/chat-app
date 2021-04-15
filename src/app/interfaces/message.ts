import { User } from './user';

export interface Message {
    date: string;
    text: string;
    author: User;
    timestamp?: string;
}
