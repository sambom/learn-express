import fs, { promises as fsPromises } from 'fs';
import path from 'path';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import readUsers from './readUsers';
import writeUsers from './writeUsers';
import { UserRequest } from './types';
import { User } from './types';

const app = express();
const port = 8000;
const dataFile = '../data/users.json';


let users: User[];

// a synchronous function that reads the user data from the file
async function readUsersFile() {
  try {
    console.log('reading file ... ');
    const data = await fsPromises.readFile(path.resolve(__dirname, dataFile));
    users = JSON.parse(data.toString());
    console.log('File read successfully');
  } catch (err) {
    console.error('Error reading file:', err);
    throw err;
  }
}

readUsersFile();

// a middleware function that adds the users data to the request object
const addMsgToRequest = (req: UserRequest, res: Response, next: NextFunction) => {
  if (users) {
    req.users = users;
    next();
  } else {
    return res.json({
      error: { message: 'users not found', status: 404 }
    });
  }
};

// a middleware function the verifies the origin of the request using a cors package
app.use(cors({ origin: 'http://localhost:3000' }));
// adds the middleware function to the application
app.use('/read', addMsgToRequest);


app.use('/read', readUsers);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/write', addMsgToRequest);

app.use('/write', writeUsers);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
