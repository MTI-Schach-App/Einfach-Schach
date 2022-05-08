import { Course } from './training';

export interface User {
    id: number;
    name: string;
    level: number;
    currentGame: string;
    currentCourse: string;
    dateUpdated: string;
    dateCreated: string;
    coursesFinished: Course[];
    wantsToClick: boolean;
  }

export interface UserState {
  users: User[];
  loggedInUser: User,
  setLoggedInState: (user:User) => void;
}