import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseService } from '../../../utils/supabase';
import { options } from '../../../utils/imdb';
import { Database } from '../../../types/supabase';

type RatingNeeded = Pick<
  Database['public']['Tables']['catalog']['Row'],
  'title' | 'imdbid' | 'year' | 'rating'
>;
/*
 * add ratings from unogs => add to types
 * get items from db that have null of 0 rating
 * get ratings from imdb8 api, using the tt-id => fetch('https://imdb8.p.rapidapi.com/title/get-ratings?tconst=tt2211129', options)
 * add types for the ratings response
 * add ratings to db
 *
 * if no tt-id, use title/v2/find endpoint => fetch('https://imdb8.p.rapidapi.com/title/v2/find?title=sodium%20day', options)
 * add types for the search response
 * verify that the title matches with the 'string-similarity' npm package
 * if close enough, take item id (tt-id) and use it to get the ratings
 *
 * use title/get-videos and title/get-video-playback to get trailers
 * */

const nullRatingsFromDB = async () => {
  const { data, error } = await supabaseService
    .from('catalog')
    .select('title, imdbid, year, rating')
    .or('rating.is.null, rating.eq.0');

  if (error) {
    console.log('Error:', {
      message: error.message,
      details: error.details,
    });
  }

  return data;
};

const getRating = async () => {
  const catalogFromDB = await nullRatingsFromDB();

  let itemsNoRatings: RatingNeeded[] = [];
  let itemsNoImdbId: RatingNeeded[] = [];
  let itemsWithRatings;

  if (catalogFromDB != null) {
    itemsNoImdbId = catalogFromDB.filter((item) => !item.imdbid);
    itemsNoRatings = catalogFromDB.filter((item) => item.imdbid);

    itemsWithRatings = await Promise.all(
      itemsNoRatings.map(async (item: RatingNeeded) => {
        const url = `https://imdb8.p.rapidapi.com/title/get-ratings?tconst=${item.imdbid}`;
        const fetchItemRatings = await fetch(url, options);
        return await fetchItemRatings.json();
      })
    );
  }

  return itemsWithRatings;
};

const apiResponse = async (req: NextApiRequest, res: NextApiResponse) => {
  const results = await getRating();
  res.json(results);
};

export default apiResponse;
