export interface Course {
  id: number;
  start: string;
  end: string;
  moves: string[][];
}

export interface Chapter {
  id: number;
  name: string;
  subtext: string;
  courses: Course[];
}
