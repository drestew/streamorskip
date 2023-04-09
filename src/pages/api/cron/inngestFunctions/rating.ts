import { supabaseService } from '@utils/supabase';
import { options } from '@utils/imdb';
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
    for (let i = 0; i < 100; i += 10) {
      const nullFromDB = await step.run('null ratings from db', () => {
        return getNullRatingsFromDB(i);
      });

      const fetchRatingForDbItem = await step.run(
        'fetch rating for db item',
        () => {
          return getRating(nullFromDB, null);
        }
      );

      await step.run('add ratings to db', () => {
        return addRatingsToDB(fetchRatingForDbItem);
      });

      const getImdbIds = await step.run(
        'get imdb ids from title search',
        () => {
          return getImdbId(nullFromDB);
        }
      );

      await step.run('add imdb ids db', () => {
        return addImdbIdsToDB(getImdbIds);
      });

      // search items ran separately than db items to fix function timeout error in vercel
      const fetchRatingForTitleSearchItem = await step.run(
        'fetch rating for title search item',
        () => {
          return getRating(null, getImdbIds);
        }
      );

      await step.run('add ratings to db', () => {
        return addRatingsToDB(fetchRatingForTitleSearchItem);
      });
    }
  }
);

const getNullRatingsFromDB = async (rowStep: number) => {
  const { data, error } = await supabaseService
    .from('catalog')
    .select('title, imdbid, rating, nfid')
    .eq('on_Nflix', true)
    .or('rating.is.null, rating.eq.0')
    .order('id', { ascending: false })
    .range(rowStep, rowStep + 10);

  if (error) {
    console.log('Error:', {
      message: error.message,
      details: error.details,
    });
  }

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
        .eq('nfid', item.nfid);

      if (error) console.error(error);
    });

  return itemsWithImdbIds;
};

const getImdbId = async (catalogFromDB: Awaited<NeedRating>) => {
  // need imdb id in order to get rating
  let itemsNoImdbId: NeedRating;
  let itemsWithImdbIds: ImdbIdItem[] = [];
  let dbItem: { title: string; imdbid: string | null; nfid: number };
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
                ? {
                    title: title,
                    imdbid: `tt${formattedId}`,
                    nfid: itemsNoImdbId.nfid,
                  }
                : { title: title, imdbid: null, nfid: itemsNoImdbId.nfid };
          } else {
            dbItem = {
              title: itemsNoImdbId.title,
              imdbid: null,
              nfid: itemsNoImdbId.nfid,
            };
          }
          return dbItem;
        } catch {
          console.log('Error: ', itemsNoImdbId);
          return {
            title: itemsNoImdbId.title,
            imdbid: null,
            nfid: itemsNoImdbId.nfid,
          };
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
  newImdbIds: Awaited<ImdbIdItem>[] | null
) => {
  let itemsWithNewImdbId: Awaited<ImdbIdItem>[] = [];
  let itemsNoRatings: NeedRating;
  let itemsWithRatings: ImdbRatingItem[] = [];

  if (catalogFromDB && catalogFromDB.length > 0) {
    itemsNoRatings = catalogFromDB.filter((item) => item.imdbid);

    const imdbArr = extractImdbIds(itemsNoRatings);

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

  // duplication necessary to fix function timeout error in vercel
  if (newImdbIds && newImdbIds.length > 0) {
    itemsWithNewImdbId = newImdbIds;
    const imdbArr = extractImdbIds(itemsWithNewImdbId);

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

  return itemsWithRatings.filter((item) => item && item.rating);
};

const addRatingsToDB = async (ratedItemsPromise: Awaited<ImdbRatingItem[]>) => {
  let ratedItems = ratedItemsPromise;
  let itemsAddedToDb;
  let itemsNotAddedToDb;

  try {
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