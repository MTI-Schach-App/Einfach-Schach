import { usersRepo } from '../../../utils/database';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function verify(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const image = req.body.img;
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ img: [image] })
  };
  const response = await fetch(
    'http://127.0.0.1:5000/verify',
    requestOptions
  );
  const data = await response.json();
  console.log(data);

  return res.status(200).json(data);
}
