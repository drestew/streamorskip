import ratingUpdate from './rating';
import genreUpdate from './genre';

export type Env = {
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
  IMDB_KEY: string;
  CATALOG_HOST: string;
  CATALOG_KEY: string;
};

const handleWorker = {
  async fetch(req: Request, env: Env) {
    const { pathname } = new URL(req.url);
    let resp;

    switch (pathname) {
      case '/updateRatings':
        resp = await ratingUpdate.fetch(req, env);
        break;
      case '/updateGenres':
        resp = await genreUpdate.fetch(req, env);
        break;
      default:
        resp = new Response('404, not found!', { status: 404 });
    }

    return resp;
  },
};

export default handleWorker;
