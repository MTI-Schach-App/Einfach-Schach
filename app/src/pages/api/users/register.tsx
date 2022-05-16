import { usersRepo } from '../../../utils/database';
import { NextApiRequest, NextApiResponse } from 'next';

export default function register(
  req: NextApiRequest,
  res: NextApiResponse
): void {
  const user = req.body.user;
  const img = req.body.screenshot;

  const resp = usersRepo.create(user, img);
  return res.status(200).json(resp);
}
