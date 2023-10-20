import ratingUpdate from './rating';

export type Env = {
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
  IMDB_KEY: string;
};

const handleWorker = {
  async fetch(req: Request, env: Env) {
    const { pathname } = new URL(req.url);
    let resp;

    switch (pathname) {
      case '/updateRatings':
        resp = await ratingUpdate.fetch(req, env);
        break;
      default:
        resp = new Response('404, not found!', { status: 404 });
    }

    return resp;
  },
};

export default handleWorker;
