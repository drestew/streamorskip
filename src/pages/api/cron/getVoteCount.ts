import { SupabaseClient } from '@supabase/supabase-js';
import { ImdbIdItem } from './types';
import { Env } from './index';
import { Database } from '@src/types/supabase';
import { ValidationError } from 'runtypes';

type VoteCount = Awaited<{
  imdbid: string | null;
  rating: number | null;
  voteCount: number | null;
  newVoteCount: number | null;
}>;

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
  let itemsWithVoteCount: VoteCount[] = [];

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
          newVoteCount: null,
        };
      })
    );
  }

  return itemsWithVoteCount.filter(
    (item) => item.imdbid && item.rating && item.voteCount
  );
}

function modifyVoteCount(voteCount: number | null) {
  if (!voteCount || voteCount === 0) {
    return null;
  }

  const voteCountStr = voteCount.toString();
  let newVoteCount = null;

  if (voteCountStr.length === 5) {
    const firstNumber = getRandomIntInclusive(7, 9);
    newVoteCount = voteCountStr.substring(0, voteCountStr.length - 2);
    newVoteCount = `${firstNumber}${newVoteCount}`;
  } else if (voteCountStr.length === 6 && voteCount < 500000) {
    newVoteCount = `1${voteCountStr.substring(1, 5)}`;
  } else if (voteCountStr.length === 6 && voteCount < 999999) {
    newVoteCount = `2${voteCountStr.substring(1, 5)}`;
  } else if (voteCountStr.length > 6) {
    newVoteCount = `3${voteCountStr.substring(1, 5)}`;
  }

  return Number(newVoteCount) || voteCount;
}

function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function updateVoteCount(voteCounts: VoteCount[]) {
  return voteCounts.map((item) => {
    const newVoteCount = modifyVoteCount(item.voteCount || null);
    return { ...item, newVoteCount };
  });
}

const getVoteCount = {
  async fetch(req: Request, env: Env, supabase: SupabaseClient<Database>) {
    const ratings = await getRatingsFromDB(supabase);
    const ratingCounts = await getRatingCountsFromImdb(ratings, env.IMDB_KEY);
    const updatedCounts = updateVoteCount(ratingCounts);
    return new Response(JSON.stringify(updatedCounts), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
};

export default getVoteCount;
