import create from 'zustand';
import { User, UserState } from '../interfaces/user';

export const useStore = create<UserState>((set) => ({
  users: [],
  loggedInUser: {
    id: 0,
    name: 'None',
    displayName: 'None',
    currentGame: '',
    level: 0,
    ep: 0,
    dateCreated: '',
    dateUpdated: '',
    coursesFinishedTotal: 0,
    wantsToClick: true,
    animationSpeed: 2000,
    chapterProgression: {}
  },
  setLoggedInState: (user: User) => {
    set(() => ({
      loggedInUser: user
    }));
  },
  currentScreenshot: '',
  setCurrentScreenshot: (hash: string) => {
    set(() => ({
      currentScreenshot: hash
    }));
  }
}));
