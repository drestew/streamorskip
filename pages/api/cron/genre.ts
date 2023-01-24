import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseService } from '../../../utils/supabase';
import { options } from '../../../utils/unogs';

type Genre = {
  nfid: number;
  genres: [
    {
      nfid: number;
      genre: string;
    }
  ];
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
  const genres: Genre[] = await getGenres();

  if (genres) {
    for (let i = 0; i < genres.length; i++) {
      const { error } = await supabaseService.from('catalog-genre').insert(
        genres[i].genres.map((item) => {
          return {
            ['catalog-nfid']: genres[i].nfid,
            genre: item.genre,
            ['genre-nfid']: item.nfid,
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

    for (let i = 0; i < genres.length; i++) {
      const { error } = await supabaseService
        .from('catalog')
        .update({ genre: true })
        .eq('nfid', genres[i].nfid);
      ``;
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
  res.redirect('/api/cron/trailer');
};

export default apiResponse;
