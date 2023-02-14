import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseService } from '../../../../utils/supabase';
import { options } from '../../../../utils/unogs';
import { Genre, Genres } from '../types';
import { Inngest } from 'inngest';

const inngest = new Inngest({ name: 'streamorskip' });

export default inngest.createStepFunction(
  'Get genres',
  'cron/genre',
  ({ tools }) => {
    tools.run('get lookback date', () => {
      return testFunc();
    });

    // tools.run('get new content', async () => {
    //   // return await fetchNewContent();
    // });
  }
);

const testFunc = () => {
  return { working: true };
};

const getCatalogFromDB = async () => {
  const { data, error } = await supabaseService
    .from('catalog')
    .select('nfid')
    .eq('genre', 'false');

  if (error) {
    console.log('Error:', {
      message: error.message,
      details: error.details,
    });
  }

  return data;
};

const getGenres = async () => {
  const catalog = await getCatalogFromDB();
  let genres: Genre[] = [];

  if (catalog) {
    genres = await Promise.all(
      catalog.map(async (item) => {
        const url = `https://unogsng.p.rapidapi.com/titlegenres?netflixid=${item.nfid}`;
        const getGenres = await fetch(url, options);
        const { results } = await getGenres.json();

        return { nfid: item.nfid, genres: results };
      })
    );
  }

  return genres;
};

const addGenresToDB = async () => {
  let genreResults = await getGenres();

  genreResults = Genres.check(genreResults);

  if (genreResults) {
    for (const item of genreResults) {
      if (item.genres) {
        const { error } = await supabaseService.from('catalog-genre').insert(
          item.genres.map((genre) => {
            return {
              ['catalog-nfid']: item.nfid,
              genre: genre.genre,
              ['genre-nfid']: genre.nfid,
            };
          })
        );

        if (error) {
          console.log('Error:', {
            message: error.message,
            details: error.details,
          });
        }
      }
    }

    for (const item of genreResults) {
      const { error } = await supabaseService
        .from('catalog')
        .update({ genre: true })
        .eq('nfid', item.nfid);

      if (error) {
        console.log('Error:', {
          message: error.message,
          details: error.details,
        });
      }
    }
  }
};

const apiResponse = async (req: NextApiRequest, res: NextApiResponse) => {
  await addGenresToDB();
  res.json({ success: 200 });
};

// export default apiResponse;
