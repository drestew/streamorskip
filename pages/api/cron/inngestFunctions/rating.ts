import { supabaseService } from '../../../../utils/supabase';
import { options } from '../../../../utils/imdb';
import { ImdbIdItem, ImdbRatingItem, ImdbRatingItems } from '../types';
import { ValidationError } from 'runtypes';
import { distance } from 'fastest-levenshtein';
import Bottleneck from 'bottleneck';
import { Inngest } from 'inngest';

type NeedRating = Awaited<ReturnType<typeof getNullRatingsFromDB>>;

const limiter = new Bottleneck({ minTime: 300 });
const limiterImdbId = new Bottleneck({ minTime: 600 });
const inngest = new Inngest({ name: 'streamorskip' });

export default inngest.createFunction(
  { name: 'Get ratings' },
  { event: 'cron/rating' },
  async ({ step }) => {
    const nullFromDB = await step.run('null ratings from db', () => {
      return getNullRatingsFromDB();
    });

    const getImdbIds = await step.run('get imdb ids', () => {
      return getImdbId(nullFromDB);
    });

    await step.run('add imdb ids db', () => {
      return addImdbIdsToDB(getImdbIds);
    });

    const fetchRating = await step.run('fetch rating', () => {
      return getRating(nullFromDB, getImdbIds);
    });

    await step.run('add ratings to db', () => {
      return addRatingsToDB(fetchRating);
    });
  }
);

const getNullRatingsFromDB = async () => {
  const { data, error } = await supabaseService
    .from('catalog')
    .select('title, imdbid, rating')
    .or('rating.is.null, rating.eq.0')
    .order('id', { ascending: false })
    .range(0, 100);

  if (error) {
    console.log('Error:', {
      message: error.message,
      details: error.details,
    });
  }
  console.log(data);
  return data;
};

const addImdbIdsToDB = async (itemsWithImdbIds: ImdbIdItem[]) => {
  itemsWithImdbIds.length > 0 &&
    itemsWithImdbIds.map(async (item) => {
      const { error } = await supabaseService
        .from('catalog')
        .update({
          imdbid: item.imdbid,
        })
        .eq('title', item.title);

      if (error) console.error(error);
    });

  return itemsWithImdbIds;
};

const getImdbId = async (catalogFromDB: Awaited<NeedRating>) => {
  // need imdb id in order to get rating
  let itemsNoImdbId: NeedRating;
  let itemsWithImdbIds: ImdbIdItem[] = [];
  let dbItem: { title: string; imdbid: string | null };
  if (catalogFromDB) {
    itemsNoImdbId = catalogFromDB.filter((item) => !item.imdbid);
    itemsWithImdbIds = await Promise.all(
      itemsNoImdbId.map(async (itemsNoImdbId) => {
        try {
          const encodedTitle = encodeURI(itemsNoImdbId.title);
          const url = `https://imdb8.p.rapidapi.com/title/v2/find?title=${encodedTitle}`;
          const titleSearch = await limiterImdbId.schedule(() =>
            fetch(url, options)
          );
          const { results, totalMatches } = await titleSearch.json();
          if (totalMatches > 0) {
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
        } catch {
          console.log('Error: ', itemsNoImdbId);
          return { title: itemsNoImdbId.title, imdbid: null };
        }
      })
    ).then((imdbItems) => imdbItems.filter((item) => item.imdbid));
  }

  return itemsWithImdbIds;
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

  return [...imdbItemsArr, ...dbItemsArr].filter((item) => item);
};

const getRating = async (
  catalogFromDB: Awaited<NeedRating>,
  newImdbIds: Awaited<ImdbIdItem>[]
) => {
  let itemsWithNewImdbId: Awaited<ImdbIdItem>[] = [];
  let itemsNoRatings: NeedRating;
  let itemsWithRatings: ImdbRatingItem[] = [];

  if (catalogFromDB && catalogFromDB.length > 0) {
    itemsWithNewImdbId = newImdbIds;
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

const addRatingsToDB = async (ratedItemsPromise: Awaited<ImdbRatingItem[]>) => {
  let ratedItems = ratedItemsPromise;
  let itemsAddedToDb;
  let itemsNotAddedToDb;

  try {
    ratedItems = ratedItems.filter((item) => item);
    ratedItems = ImdbRatingItems.check(ratedItems);
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

        itemsAddedToDb = ratedItems
          .map((item) => {
            return {
              title: item.title,
              id: item.id,
              rating: item.rating,
            };
          })
          .filter((item) => item.rating);

        itemsNotAddedToDb = ratedItems
          .map((item) => {
            return {
              title: item.title,
              id: item.id,
              rating: item.rating,
            };
          })
          .filter((item) => !item.rating);
      });
    }
  } catch (error) {
    if (error instanceof ValidationError)
      console.error('Error:', {
        code: error.code,
        details: error.details,
      });
  }

  return {
    ratingsAdded: itemsAddedToDb,
    ratingsNotAdded: itemsNotAddedToDb,
  };
};
