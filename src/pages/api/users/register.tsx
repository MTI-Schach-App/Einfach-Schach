
import { usersRepo } from '../../../utils/database';
import { NextApiRequest, NextApiResponse } from 'next';


export default function register(req: NextApiRequest, res: NextApiResponse):void {
    const user = req.body;

    if (usersRepo.find(x => x.name === user.name))
        throw `User with the username "${user.name}" already exists`;

    const resp = usersRepo.create(user);
    return res.status(200).json(resp);
}