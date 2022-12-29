import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../utils/supabase';

type unogsResponse = {
  method: string;
  headers: {
    ['X-RapidAPI-Key']?: string;
    ['X-RapidAPI-Host']?: string;
  };
};

const options: unogsResponse = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': process.env.NEXT_PUBLIC_MEDIA_KEY,
    'X-RapidAPI-Host': process.env.NEXT_PUBLIC_MEDIA_HOST,
  },
};

const getNewMedia = async () => {
  const mediaData = await fetch(
    'https://unogsng.p.rapidapi.com/search?start_year=1972&orderby=rating&audiosubtitle_andor=and&limit=1&subtitle=english&countrylist=78%2C46&audio=english&country_andorunique=unique&offset=0&end_year=2019',
    options
  );
  return mediaData.json();
};

const addMediaToDB = () => {
  return supabase
    .from('media')
    .insert({ nfid: 46, title: 'second title movie' })
    .select();
};

const newMedia = async (req: NextApiRequest, res: NextApiResponse) => {
  const mediaData = await addMediaToDB();
  res.json(mediaData);
};

export default newMedia;
