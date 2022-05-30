import fs from 'fs';
import { Course } from '../interfaces/training';
import { User } from '../interfaces/user';
// users in JSON file for simplicity, store in a db for production applications
let users: User[] = require('../data/users.json');
const courses: Course[] = require('../data/training.json')['Kapitel 1'];

export const usersRepo = {
  getAll: () => users,
  getById: (id) => users.find((x) => x.id.toString() === id.toString()),
  find: (x) => users.find(x),
  create,
  updateGame,
  update,
  delete: _delete
};

export const trainingRepo = {
  getAll: () => courses,
  getById: (id) => courses.find((x) => x.id.toString() === id.toString()),
  find: (x):Course => courses.find(x)
};

function create(user: User, img: string): User {
  // generate new user id

  user.id = users.length ? Math.max(...users.map((x) => x.id)) + 1 : 1;
  user.name = user.name + user.id.toString();
  if (img) {
    (async () => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ img: [img], username: user.name })
      };
      const response = await fetch(
        'http://127.0.0.1:5000/register',
        requestOptions
      );
      const data = await response.json();
      console.log(data);
      if (data.success != true) {
        console.log(data.error);
      }
    })();
  }

  // set date created and updated
  user.dateCreated = new Date().toISOString();
  user.dateUpdated = new Date().toISOString();

  // add and save user
  users.push(user);
  saveData();
  return user;
}

function updateGame(id: number, fen: string) {
  const user = users.find((x) => x.id.toString() === id.toString());
  user.currentGame = fen;
  user.dateUpdated = new Date().toISOString();

  saveData();
}

function update(id: number, params: User) {
  const user = users.find((x) => x.id.toString() === id.toString());

  // set date updated
  user.dateUpdated = new Date().toISOString();

  // update and save
  Object.assign(user, params);
  saveData();
}

function _delete(id: number) {
  // filter out deleted user and save
  users = users.filter((x) => x.id.toString() !== id.toString());
  saveData();
}

function saveData() {
  fs.writeFileSync(
    process.cwd() + '/src/data/users.json',
    JSON.stringify(users, null, 4)
  );
}
