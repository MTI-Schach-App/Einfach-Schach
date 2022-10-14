import { Course } from './training';

export interface User {
  id: number;
  name: string;
  displayName: string;
  level: number;
  currentGame: string;
  dateUpdated: string;
  dateCreated: string;
  wantsToClick: boolean;
  animationSpeed: number;
  ep: number;
  chapterProgression: Record<number,UserChapterProgression>;
  coursesFinishedTotal: number;
}

export interface UserChapterProgression {
  completed: boolean;
  coursesFinished: number;
}

export interface UserState {
  users: User[];
  loggedInUser: User;
  setLoggedInState: (user: User) => void;
  currentScreenshot: string;
  setCurrentScreenshot: (hash: string) => void;
}
