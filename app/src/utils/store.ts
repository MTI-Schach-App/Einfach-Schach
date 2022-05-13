import create from 'zustand';
import { User, UserState} from '../interfaces/user';

export const useStore = create<UserState>((set) => ({
    users:[],
    loggedInUser: {
      id:0,
      name:'None',
      displayName: 'None',
      currentGame: '',
      currentCourse: '',
      level:0,
      dateCreated:'',
      dateUpdated:'',
      coursesFinished: [],
      wantsToClick: false,
    },
    setLoggedInState: (user:User) => {
      set(() => ({
        loggedInUser: user,
      }));
    },
    currentScreenshot:''
    ,
    setCurrentScreenshot: (hash:string) => {
      set(() => ({
        currentScreenshot: hash,
      }));
    },
  }));
