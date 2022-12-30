import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseService } from '../../utils/supabase';
import { options } from '../../utils/unogs';

type unogsAPI = {
  id?: number;
  title: string;
  img: string;
  vtype: string;
  nfid: number;
  synopsis: string;
  avgrating?: number;
  year: number;
  runtime: number;
  imdbid?: string;
  poster: string;
  imdbrating?: number;
  top250?: number;
  top250tv?: number;
  clist?: string;
  titledate: string;
};

const lookbackDate = () => {
  const dateToday = new Date();
  const fromDate = dateToday.setDate(dateToday.getDate() - 2);
  const fromDateInMS = new Date(fromDate);
  const day = fromDateInMS.getDay();
  const month = fromDateInMS.getMonth() + 1;
  const year = fromDateInMS.getFullYear();

  return `${year}-${month}-${day}`;
};

const fetchNewContent = async () => {
  const url = `https://unogsng.p.rapidapi.com/search?newdate=${lookbackDate()}
  &audiosubtitle_andor=and&subtitle=english&countrylist=78&audio=english&offset=0`;
  const mediaData = await fetch(url, options);

  return mediaData.json();
};

const addNewContentToDB = async () => {
  // const newContent: unogsAPI[] = await fetchNewContent();
  let newContent = await fetchNewContent();
  newContent = newContent.results;

  for (let i = 0; i < newContent.length; i++) {
    const item = newContent[i];
    const { error } = await supabaseService.from('catalog').insert({
      nfid: item.nfid,
      title: item.title,
      img: item.img,
      vtype: item.vtype,
      synopsis: item.synopsis,
      year: item.year,
      runtime: item.runtime,
      poster: item.poster,
      titledate: item.titledate,
    });
  }
};

const newMedia = async (req: NextApiRequest, res: NextApiResponse) => {
  const dbData = await addNewContentToDB();
  res.json(dbData);
};

export default newMedia;
