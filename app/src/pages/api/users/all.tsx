import { NextApiRequest, NextApiResponse } from 'next';
import { usersRepo } from '../../../utils/database';

const handler = (_req: NextApiRequest, res: NextApiResponse): void => {
  try {
    return res.status(200).json(usersRepo.getAll());
  } catch (err) {
    return res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
