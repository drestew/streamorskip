import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseService } from '../../../utils/supabase';
import { options } from '../../../utils/imdb';

const getNullTrailersFromDB = async () => {
  const { data, error } = await supabaseService
    .from('catalog')
    .select('imdbid, trailer')
    .is('trailer', null)
    .not('imdbid', 'is', null);

  if (error) {
    console.log('Error:', {
      message: error.message,
      details: error.details,
    });
  }

  return data;
};

const getTrailerSource = () => {
  const url =
    'https://imdb8.p.rapidapi.com/title/get-videos?tconst=tt12571294&region=US';
};

const apiResponse = async (req: NextApiRequest, res: NextApiResponse) => {
  const results = await getNullTrailersFromDB();
  res.json(results);
};

export default apiResponse;
