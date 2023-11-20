import ratingUpdate from './getRating';
import genreUpdate from './getGenres';
import addToCatalog from './addToCatalog';
import removeFromCatalog from './removeFromCatalog';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@src/types/supabase';
import getTrailer from './getTrailer';
import getVoteCount from './getVoteCount';

export type Env = {
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
  IMDB_KEY: string;
  CATALOG_HOST: string;
  CATALOG_KEY: string;
  WORKER_KEY: string;
};

const handleWorker = {
  async fetch(req: Request, env: Env) {
    const supabaseUrl = env.SUPABASE_URL;
    const supabaseKey = env.SUPABASE_KEY;
    const supabase = createClient<Database>(supabaseUrl, supabaseKey);
    const { pathname } = new URL(req.url);
    let resp;

    const workerKey = env.WORKER_KEY;
    const headerKey = req.headers.get('WORKER-KEY');

    if (workerKey !== headerKey) {
      return new Response('Sorry, you have supplied an invalid keys.', {
        status: 403,
      });
    }

    switch (pathname) {
      case '/addToCatalog':
        resp = await addToCatalog.fetch(req, env, supabase);
        break;
      case '/updateRatings':
        resp = await ratingUpdate.fetch(req, env, supabase);
        break;
      case '/updateGenres':
        resp = await genreUpdate.fetch(req, env, supabase);
        break;
      case '/removeFromCatalog':
        resp = await removeFromCatalog.fetch(req, env, supabase);
        break;
      case '/getTrailer':
        resp = await getTrailer.fetch(req, env, supabase);
        break;
      case '/getVoteCount':
        resp = await getVoteCount.fetch(req, env, supabase);
        break;
      default:
        resp = new Response('404, not found!', { status: 404 });
    }

    return resp;
  },
};

export default handleWorker;
