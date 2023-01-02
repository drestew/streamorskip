import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseService } from '../../../utils/supabase';

/*
 * get items from db
 * get ratings using the tt-id, take avg
 * add types for the ratings response
 * add ratings to db
 *
 * if no tt-id, use search endpoint using title and year
 * add types for the search response
 * the response item description should contain the year
 * use 'string-similarity' package to determine if it's close enough
 * if close enough, take item id (tt-id) and use it to get the ratings
 *
 * */

const getRatings = async () => {
  const url = `https://imdb-api.com/en/API/Ratings/${process.env.IMDB_KEY}/tt1375666`;
  const ratingsData = await fetch(url);

  return ratingsData.json();
};

const apiResponse = async (req: NextApiRequest, res: NextApiResponse) => {
  const results = await getRatings();
  res.json(results);
};

export default apiResponse;
