import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseService } from '../../../utils/supabase';
import { options } from '../../../utils/imdb';
import { ImdbRatingItem, ImdbRatingItems, ImdbIdItem } from './types';
import { ValidationError } from 'runtypes';
import { distance } from 'fastest-levenshtein';

type NeedRating = Awaited<ReturnType<typeof getNullRatingsFromDB>>;

const getNullRatingsFromDB = async () => {
  const { data, error } = await supabaseService
    .from('catalog')
    .select('title, imdbid, rating')
    .or('rating.is.null, rating.eq.0');

  if (error) {
    console.log('Error:', {
      message: error.message,
      details: error.details,
    });
  }

  return data;
};

const addImdbIdsToDB = async (itemsWithImdbIds: ImdbIdItem[]) => {
  itemsWithImdbIds.map(async (item) => {
    const { error } = await supabaseService
      .from('catalog')
      .update({
        imdbid: item.imdbid,
      })
      .eq('title', item.title);

    if (error) console.error(error);
  });
};

const getImdbId = async (catalogFromDB: NeedRating) => {
  // need imdb id in order to get rating
  let itemsNoImdbId: NeedRating;
  let itemsWithImdbIds: ImdbIdItem[] = [];

  if (catalogFromDB) {
    itemsNoImdbId = catalogFromDB.filter((item) => !item.imdbid);

    itemsWithImdbIds = await Promise.all(
      itemsNoImdbId.map(async (itemsNoImdbId) => {
        const encodedTitle = encodeURI(itemsNoImdbId.title);
        const url = `https://imdb8.p.rapidapi.com/title/v2/find?title=${encodedTitle}`;
        const titleSearch = await fetch(url, options);
        const { results } = await titleSearch.json();

        const { title, id } = results[0];
        const checkTitleMatch = distance(itemsNoImdbId.title, title);
        const formattedId = id.replace(/\D/g, ''); // '/title/tt12345678/' => '12345678'

        return checkTitleMatch <= 1
          ? { title: title, imdbid: `tt${formattedId}` }
          : { title: title, imdbid: null };
      })
    );
  }

  await addImdbIdsToDB(itemsWithImdbIds);

  return itemsWithImdbIds;
};

const extractImdbIds = (imdbItem?: ImdbIdItem[], dbItem?: NeedRating) => {
  let imdbids: (string | null)[] = [];

  if (imdbItem) {
    imdbids = imdbItem.map((item) => {
      return item.imdbid;
    });
    return imdbids;
  }

  if (dbItem) {
    imdbids = dbItem.map((item) => {
      return item.imdbid;
    });
    return imdbids;
  }

  return imdbids;
};

const getRating = async () => {
  const catalogFromDB = await getNullRatingsFromDB();
  const itemsWithNewImdbId = await getImdbId(catalogFromDB);

  let itemsNoRatings: NeedRating;
  let itemsWithRatings: ImdbRatingItem[] = [];

  if (catalogFromDB) {
    itemsNoRatings = catalogFromDB.filter((item) => item.imdbid);
    const imdbArr = extractImdbIds(itemsWithNewImdbId, itemsNoRatings);

    itemsWithRatings = await Promise.all(
      imdbArr.map(async (item) => {
        if (item) {
          const url = `https://imdb8.p.rapidapi.com/title/get-ratings?tconst=${item}`;
          const fetchItemRatings = await fetch(url, options);

          return fetchItemRatings.json();
        }
      })
    );
  }

  return itemsWithRatings;
};

const addRatingsToDB = async () => {
  let ratedItems = await getRating();
  const itemsNotAddedToDb: Pick<ImdbRatingItem, 'id' | 'title'>[] = [];
  console.log(ratedItems);
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
      if (item.id) {
        const id = item.id.replace(/\D/g, '');
        const { error } = await supabaseService
          .from('catalog')
          .update({
            rating: item.rating ?? 999,
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

  return {
    ratingsAdded: ratedItems.length - itemsNotAddedToDb.length,
    ratingsNotAdded: [...itemsNotAddedToDb],
  };
};

const apiResponse = async (req: NextApiRequest, res: NextApiResponse) => {
  const results = await addRatingsToDB();
  res.json(results);
};

export default apiResponse;
