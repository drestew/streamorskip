import { Env } from './index';
import { SupabaseClient } from '@supabase/supabase-js';
import { TrailerItem, TrailerItems } from './types';
import { ValidationError } from 'runtypes';

type DBItem = {
  imdbid: string;
  trailer: string | null;
};

async function getNullTrailersFromDB(env: Env, supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('catalog')
    .select('imdbid, trailer')
    .is('trailer', null)
    .not('imdbid', 'is', null)
    .order('id', { ascending: false })
    .range(0, 1);

  if (error) {
    console.error('Error getting null trailers:', {
      message: error.message,
      details: error.details,
    });
  }

  return data;
}

async function fetchTrailer(env: Env, nullTrailers: DBItem[] | null) {
  let trailerItem: TrailerItem[] = [];

  if (!nullTrailers || nullTrailers.length === 0) {
    return null;
  }

  const trailers: TrailerItem[] = await Promise.all(
    nullTrailers.map(async (title) => {
      const trailerResponse = await fetch(
        `https://imdb-api.com/en/API/Trailer/${env.IMDB_KEY}/${title.imdbid}`
      );
      return trailerResponse.json();
    })
  );

  try {
    trailerItem = TrailerItems.check(trailers);
  } catch (error) {
    if (error instanceof ValidationError)
      console.error('Error validating imdb trailer api types:', {
        code: error.code,
        stack: error.stack,
      });
  }

  return trailerItem
    .map((item) => {
      return {
        imdbid: item.imDbId,
        trailer: item.linkEmbed,
      };
    })
    .filter((item) => item.trailer);
}

async function addTrailerToDB(
  supabase: SupabaseClient,
  trailerResults: DBItem[] | null
) {
  const trailersAdded: DBItem[] = [];
  if (!trailerResults) {
    return null;
  }

  for (const trailerResult of trailerResults) {
    const { error } = await supabase
      .from('catalog')
      .update({ trailer: trailerResult.trailer })
      .eq('imdbid', trailerResult.imdbid)
      .select();

    if (error) {
      console.log('Error adding trailer to db:', {
        message: error.message,
        details: error.details,
      });
    }

    trailersAdded.push({
      imdbid: trailerResult.imdbid,
      trailer: trailerResult.trailer,
    });
  }

  return { trailersAdded };
}

const getTrailer = {
  async fetch(req: Request, env: Env, supabase: SupabaseClient) {
    const titlesWithNullTrailer = await getNullTrailersFromDB(env, supabase);
    const trailerResults = await fetchTrailer(env, titlesWithNullTrailer);
    const dbResults = await addTrailerToDB(supabase, trailerResults);

    return new Response(JSON.stringify(dbResults), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
};

export default getTrailer;
