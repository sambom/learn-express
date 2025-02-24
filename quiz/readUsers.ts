import express, { Response, Request, NextFunction } from 'express';
import { UserRequest } from './types';
import { User } from './types';

const router = express.Router();

/**
 * A route that returns a list of usernames
 * @param req the request object
 * @param res the response object
 * @returns a list of usernames
 */
router.get('/usernames', (req: UserRequest, res: Response) => {
    let usernames = req.users?.map((user) => {
        return { id: user.id, username: user.username };
    }
    );
    res.send(usernames);
}
);

/**
 * A route that filters the users by the username and sends the user object to the client
 * @param req the request object
 * @param res the response object
 * @returns the user object
 */
router.get('/username/:name', (req: UserRequest, res: Response) => {
    let name = req.params.name;
    let user = req.users?.filter(user => user.username == name);

    if (!user) {
        res.send({ error: 'user not found', status: 404 });
    }

    res.send(user);
}
);

export default router;