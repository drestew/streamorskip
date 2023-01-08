import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseService } from '../../../utils/supabase';
import { options } from '../../../utils/imdb';
import { Database } from '../../../types/supabase';
import { CatalogItem, ImdbRatingItem, ImdbRatingItems } from './types';
import { instanceOf } from 'prop-types';
import { ValidationError } from 'runtypes';
import { decodeHTML } from 'entities';

type NeedsRating = Pick<
  Database['public']['Tables']['catalog']['Row'],
  'title' | 'imdbid' | 'year' | 'rating'
>;
/*
 * add ratings from unogs => add to types
 * get items from db that have null or 0 rating
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

  let itemsNoRatings: NeedsRating[] = [];
  let itemsNoImdbId: NeedsRating[] = [];
  let itemsWithRatings;

  if (catalogFromDB != null) {
    itemsNoImdbId = catalogFromDB.filter((item) => !item.imdbid);
    itemsNoRatings = catalogFromDB.filter((item) => item.imdbid);

    itemsWithRatings = await Promise.all(
      itemsNoRatings.map(async (item: NeedsRating) => {
        const url = `https://imdb8.p.rapidapi.com/title/get-ratings?tconst=${item.imdbid}`;
        const fetchItemRatings = await fetch(url, options);

        return fetchItemRatings.json();
      })
    );
  }

  return itemsWithRatings;
};

const addRatingsToDB = async () => {
  let ratedItems = await getRating();
  const ratingsAndIds: Pick<ImdbRatingItem, 'id' | 'rating'>[] = [];
  const itemsNotAddedToDb: Pick<ImdbRatingItem, 'id' | 'title'>[] = [];

  try {
    ratedItems = ImdbRatingItems.check(ratedItems);
  } catch (error) {
    if (error instanceof ValidationError)
      console.error('Error:', {
        code: error.code,
        details: error.details,
      });
  }

  if (ratedItems) {
    ratedItems.map(async (item) => {
      if (item.id && item.rating) {
        const id = item.id.replace(/\D/g, '');
        console.log(id);
        const { error } = await supabaseService
          .from('catalog')
          .update({
            rating: item.rating,
          })
          .eq('imdbid', `tt${id}`);

        if (error) {
          itemsNotAddedToDb.push({
            id: id,
            title: item.title,
          });
          console.log('Error:', {
            message: error.message,
            details: error.details,
          });
        }
      }
    });
  }

  console.log(ratedItems);
  return itemsNotAddedToDb.length === 0
    ? { success: 201 }
    : { Error: [...itemsNotAddedToDb] };
};

const apiResponse = async (req: NextApiRequest, res: NextApiResponse) => {
  const results = await addRatingsToDB();
  res.json(results);
};

export default apiResponse;
