import type { NextApiRequest, NextApiResponse } from 'next';
import { Inngest } from 'inngest';

const inngest = new Inngest({ name: 'streamorskip' });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Send event payload to Inngest
  await inngest.send({
    name: 'cron/addToCatalog',
    data: {},
  });

  res.status(200).json({ success: 200 });
}
