
import { usersRepo } from '../../../utils/database';
import { NextApiRequest, NextApiResponse } from 'next';

export default function setGamePost(req: NextApiRequest, res: NextApiResponse):void {
    const rep = req.body;

    if (!usersRepo.find(x => x.id === Number(rep.id)))
        throw `User with ID  "${rep.id}" does not exist`;
    
    usersRepo.updateGame(rep.id,rep.fen);
    return res.status(200).json({});
}