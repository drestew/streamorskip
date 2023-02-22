import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseService } from '../../../../utils/supabase';
import { options } from '../../../../utils/imdb';
import { ImdbRatingItem, ImdbRatingItems, ImdbIdItem } from '../types';
import { ValidationError } from 'runtypes';
import { distance } from 'fastest-levenshtein';
import Bottleneck from 'bottleneck';
import { Inngest } from 'inngest';

type NeedRating = Awaited<ReturnType<typeof getNullRatingsFromDB>>;

const limiter = new Bottleneck({ minTime: 300 });
const inngest = new Inngest({ name: 'streamorskip' });

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
  let itemsWithImdbIds: Promise<ImdbIdItem>[] = [];
  let dbItem: { title: string; imdbid: string | null };
  if (catalogFromDB) {
    itemsNoImdbId = catalogFromDB.filter((item) => !item.imdbid);
    itemsWithImdbIds = itemsNoImdbId.map(async (itemsNoImdbId) => {
      const encodedTitle = encodeURI(itemsNoImdbId.title);
      const url = `https://imdb8.p.rapidapi.com/title/v2/find?title=${encodedTitle}`;
      const titleSearch = await limiter.schedule(() => fetch(url, options));
      const { results } = await titleSearch.json();
      if (results?.length > 0) {
        const { title, id } = results[0];
        const checkTitleMatch = distance(itemsNoImdbId.title, title);
        const formattedId = id.replace(/\D/g, ''); // '/title/tt12345678/' => '12345678'

        dbItem =
          checkTitleMatch <= 1
            ? { title: title, imdbid: `tt${formattedId}` }
            : { title: title, imdbid: null };
      } else {
        dbItem = { title: itemsNoImdbId.title, imdbid: null };
      }
      return dbItem;
    });
  }
  const resolved = await Promise.all(itemsWithImdbIds.map((item) => item));
  const resolvedWithImdbId = resolved.filter((item) => item.imdbid);
  await addImdbIdsToDB(resolvedWithImdbId);

  return resolvedWithImdbId;
};

const extractImdbIds = (imdbItem?: ImdbIdItem[], dbItem?: NeedRating) => {
  let imdbItemsArr: (string | null)[] = [];
  let dbItemsArr: (string | null)[] = [];

  if (imdbItem) {
    imdbItemsArr = imdbItem.map((item) => {
      return item.imdbid;
    });
  }

  if (dbItem) {
    dbItemsArr = dbItem.map((item) => {
      return item.imdbid;
    });
  }

  return [...imdbItemsArr, ...dbItemsArr];
};

const getRating = async () => {
  const catalogFromDB = await getNullRatingsFromDB();
  let itemsWithNewImdbId: Awaited<ImdbIdItem>[] = [];
  let itemsNoRatings: NeedRating;
  let itemsWithRatings: ImdbRatingItem[] = [];

  if (catalogFromDB && catalogFromDB.length > 0) {
    itemsWithNewImdbId = await getImdbId(catalogFromDB);
    itemsNoRatings = catalogFromDB.filter((item) => item.imdbid);

    const imdbArr = extractImdbIds(itemsWithNewImdbId, itemsNoRatings);
    itemsWithRatings = await Promise.all(
      imdbArr.map(async (item) => {
        if (item) {
          const url = `https://imdb8.p.rapidapi.com/title/get-ratings?tconst=${item}`;
          const fetchItemRatings = await limiter.schedule(() =>
            fetch(url, options)
          );

          return fetchItemRatings.json();
        }
      })
    );
  }
  return itemsWithRatings;
};

const addRatingsToDB = async () => {
  let ratedItems = await getRating();

  try {
    ratedItems = ImdbRatingItems.check(ratedItems);
  } catch (error) {
    if (error instanceof ValidationError)
      console.error('Error:', {
        code: error.code,
        details: error.details,
      });
  }

  if (ratedItems?.length > 0) {
    ratedItems.map(async (item) => {
      if (item.id) {
        const id = item.id.replace(/\D/g, '');
        const { error } = await supabaseService
          .from('catalog')
          .update({
            rating: item.rating,
          })
          .eq('imdbid', `tt${id}`);

        if (error) {
          console.log('Error:', {
            message: error.message,
            details: error.details,
          });
        }
      }
    });
  }

  const itemsAddedToDb = ratedItems
    .map((item) => {
      return {
        title: item.title,
        id: item.id,
        rating: item.rating,
      };
    })
    .filter((item) => item.rating);

  const itemsNotAddedToDb = ratedItems
    .map((item) => {
      return {
        title: item.title,
        id: item.id,
        rating: item.rating,
      };
    })
    .filter((item) => !item.rating);

  return {
    ratingsAdded: itemsAddedToDb,
    ratingsNotAdded: itemsNotAddedToDb,
  };
};

const apiResponse = async (req: NextApiRequest, res: NextApiResponse) => {
  const resp = await addRatingsToDB();
  res.json(resp);
};

// export default apiResponse;
