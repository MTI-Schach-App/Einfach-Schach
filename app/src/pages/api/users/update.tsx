import { NextApiRequest, NextApiResponse } from 'next';
import { usersRepo } from '../../../utils/database';

export default function updatePost(
  req: NextApiRequest,
  res: NextApiResponse
): void {
  const rep = req.body;

  if (!usersRepo.find((x) => x.id === Number(rep.id)))
    throw `User with ID  "${rep.id}" does not exist`;

  usersRepo.update(rep.id, rep);
  return res.status(200).json({});
}
