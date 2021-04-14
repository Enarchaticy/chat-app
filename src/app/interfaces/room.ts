import { User } from './user';
import { Message } from './message';

export enum Visibility {
  private = 'private',
  protected = 'protected',
  public = 'public',
}

export interface Room {
  id?: string;
  queryId?: string;
  name?: string;
  visibility?: Visibility;
  password?: string;
  members?: User[];
  memberIds?: string[];
  messages?: Message[];
  memberNumber?: number;
}
