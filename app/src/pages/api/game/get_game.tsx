
import { usersRepo } from '../../../utils/database';
import { NextApiRequest, NextApiResponse } from 'next';

export default function getGamePost(req: NextApiRequest, res: NextApiResponse):void {
    const rep = req.query;

    if (!usersRepo.find(x => x.id === Number(rep.id)))
        throw `User with ID  "${rep.id}" does not exist`;
    
    const user = usersRepo.getById(rep.id);
    return res.status(200).json({fen:user.currentGame});
}