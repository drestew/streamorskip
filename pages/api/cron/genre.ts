import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseService } from '../../../utils/supabase';
import { options } from '../../../utils/unogs';

const getCatalogFromDB = async () => {
  const { data, error } = await supabaseService.from('catalog').select('nfid');

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
  let genres;

  if (catalog) {
    genres = Promise.all(
      catalog.map(async (item) => {
        const url = `https://unogsng.p.rapidapi.com/titlegenres?netflixid=${item.nfid}`;
        const getGenres = await fetch(url, options);

        return getGenres.json();
      })
    );
  }

  return genres;
};

const apiResponse = async (req: NextApiRequest, res: NextApiResponse) => {
  const result = await getGenres();
  res.json(result);
};

export default apiResponse;
