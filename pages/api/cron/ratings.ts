import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseService } from '../../../utils/supabase';

const getRatings = async () => {
  const url = `https://imdb-api.com/en/API/Ratings/${process.env.IMDB_KEY}/tt1375666`;
  const ratingsData = await fetch(url);

  return ratingsData.json();
};

const apiResponse = async (req: NextApiRequest, res: NextApiResponse) => {
  const result = await getRatings();
  res.json({ result });
};

export default apiResponse;
