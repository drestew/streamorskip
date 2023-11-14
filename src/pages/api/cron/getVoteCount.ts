import { SupabaseClient } from '@supabase/supabase-js';
import { ImdbIdItem } from './types';
import { Env } from './index';
import { Database } from '@src/types/supabase';
import { ValidationError } from 'runtypes';

async function getRatingsFromDB(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from('catalog')
    .select('imdbid, rating')
    .eq('on_Nflix', true)
    .not('imdbid', 'is', null)
    .gt('rating', 0)
    .order('created_at', { ascending: false })
    .range(0, 2);

  if (error) {
    console.log('Error getting ratings from DB:', {
      message: error.message,
      details: error.details,
    });
  }

  return data;
}

async function getRatingCountsFromImdb(
  catalogFromDB: { imdbid: string | null; rating: number | null }[] | null,
  imdbKey: string
) {
  let itemsWithVoteCount: Awaited<{
    imdbid: string | null;
    rating: number | null;
    voteCount: number | null;
  }>[] = [];

  if (catalogFromDB && catalogFromDB.length > 0) {
    itemsWithVoteCount = await Promise.all(
      catalogFromDB.map(async (item) => {
        const url = `https://imdb-api.com/en/API/UserRatings/${imdbKey}/${item.imdbid}`;
        const fetchItemRatingCount = await fetch(url);
        let imdbItem: Awaited<ImdbIdItem> = await fetchItemRatingCount.json();
        try {
          imdbItem = ImdbIdItem.check(imdbItem);
        } catch (error) {
          if (error instanceof ValidationError)
            console.error('Error validating imdb api types:', {
              code: error.code,
              stack: error.stack,
            });
        }
        return {
          ...item,
          voteCount: Number(imdbItem.totalRatingVotes) || null,
        };
      })
    );
  }

  return itemsWithVoteCount.filter(
    (item) => item.imdbid && item.rating && item.voteCount
  );
}

const getVoteCount = {
  async fetch(req: Request, env: Env, supabase: SupabaseClient<Database>) {
    const ratings = await getRatingsFromDB(supabase);
    const ratingCounts = await getRatingCountsFromImdb(ratings, env.IMDB_KEY);

    return new Response(JSON.stringify(ratingCounts), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
};

export default getVoteCount;
