import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseService } from '../../utils/supabase';
import { options } from '../../utils/unogs';

const getNewContent = async () => {
  const mediaData = await fetch(
    'https://unogsng.p.rapidapi.com/search?start_year=1972&orderby=rating&audiosubtitle_andor=and&limit=1&subtitle=english&countrylist=78%2C46&audio=english&country_andorunique=unique&offset=0&end_year=2019',
    options
  );
  return mediaData.json();
};

const addNewContentToDB = () => {
  return supabaseService
    .from('catalog')
    .insert({ nfid: 46, title: 'second title movie' })
    .select();
};

const newMedia = async (req: NextApiRequest, res: NextApiResponse) => {
  const mediaData = await addNewContentToDB();
  res.json(mediaData);
};

export default newMedia;
