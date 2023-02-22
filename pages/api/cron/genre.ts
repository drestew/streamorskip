import type { NextApiRequest, NextApiResponse } from 'next';
import { inngest } from '../inngest';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Send event payload to Inngest
  await inngest.send({
    name: 'cron/genre',
    data: {},
  });

  res.status(200).json({ success: 200 });
}
