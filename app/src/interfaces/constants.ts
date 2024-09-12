import { User } from "./user";

export const defaultBoard = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1';

export const defaultUserSchema : User = {
    id: 0,
    name: 'None',
    displayName: '',
    level: 0,
    ep:0,
    currentGame: '',
    dateUpdated: '0',
    dateCreated: '0',
    coursesFinishedTotal: 0,
    wantsToClick: false,
    animationSpeed: 2000,
    chapterProgression: {},
    blindMode: false,
    figureSound: false,
    boardSound: false
  }