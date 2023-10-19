import { ImdbIdItem, ImdbIdItems } from './types';
import { ValidationError } from 'runtypes';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@src/types/supabase';

type NeedRating = Awaited<ReturnType<typeof getNullRatingsFromDB>>;
type UpdatedRating = {
  title: string | null;
  imdbId: string | null;
};
export type Env = {
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
  IMDB_KEY: string;
};

async function getNullRatingsFromDB(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('catalog')
    .select('title, imdbid, rating, nfid')
    .eq('on_Nflix', true)
    .or('rating.is.null, rating.eq.0')
    .not('imdbid', 'is', null)
    .order('id', { ascending: false })
    .range(0, 100);

  if (error) {
    console.log('Error:', {
      message: error.message,
      details: error.details,
    });
  }

  return data;
}

async function getRatingsFromImdb(
  catalogFromDB: Awaited<NeedRating>,
  imdbKey: string
) {
  let itemsToBeRated: (string | null)[];
  let itemsWithRatings: ImdbIdItem[] = [];

  if (catalogFromDB && catalogFromDB.length > 0) {
    itemsToBeRated = catalogFromDB.map((item) => item.imdbid);
    itemsWithRatings = await Promise.all(
      itemsToBeRated.map(async (item) => {
        const url = `https://imdb-api.com/en/API/UserRatings/${imdbKey}/${item}`;
        const fetchItemRatings = await fetch(url);
        return fetchItemRatings.json();
      })
    );
  }
  return itemsWithRatings;
}

async function addRatingsToDB(
  supabase: SupabaseClient,
  ratedItemsPromise: Awaited<ImdbIdItem[]>
) {
  let ratedItems = ratedItemsPromise;
  const itemsWithAddedRating: UpdatedRating[] = [];
  const itemsWithNoRating: UpdatedRating[] = [];
  try {
    ratedItems = ImdbIdItems.check(ratedItems);
    ratedItems.map(async (item) => {
      if (item.totalRatingVotes === '0') {
        itemsWithNoRating.push({
          title: item.title,
          imdbId: item.imDbId,
        });
        return;
      }

      const { error } = await supabase
        .from('catalog')
        .update({
          rating: Number(item.totalRating),
        })
        .eq('imdbid', item.imDbId);

      if (error) {
        console.log('Error:', {
          message: error.message,
          details: error.details,
        });
      }

      itemsWithAddedRating.push({
        title: item.title,
        imdbId: item.imDbId,
      });
    });
  } catch (error) {
    if (error instanceof ValidationError)
      console.error('Error validating imdb api types:', {
        code: error.code,
        details: error.details,
      });
  }

  return {
    itemsWithRatingAdded: itemsWithAddedRating,
    itemsWithRatingsNotAdded: itemsWithNoRating,
  };
}

const handleRatingUpdate = {
  async fetch(request: Request, env: Env) {
    const supabaseUrl = env.SUPABASE_URL;
    const supabaseKey = env.SUPABASE_KEY;
    const supabase = createClient<Database>(supabaseUrl, supabaseKey);
    let updatedCatalogItems: {
      itemsWithRatingAdded: UpdatedRating[];
      itemsWithRatingsNotAdded: UpdatedRating[];
    } = { itemsWithRatingAdded: [], itemsWithRatingsNotAdded: [] };

    // for (let i = 0; i < 100; i += 10) {
    const nullRatings = await getNullRatingsFromDB(supabase);
    const ratedItems = await getRatingsFromImdb(nullRatings, env.IMDB_KEY);
    updatedCatalogItems = await addRatingsToDB(supabase, ratedItems);
    // }

    return new Response(JSON.stringify(updatedCatalogItems), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
};

export default handleRatingUpdate;
