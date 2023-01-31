import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseService } from '../../../utils/supabase';
import { options } from '../../../utils/unogs';
import { decodeHTML } from 'entities';
import { CatalogItem, CatalogItems } from './types';

const lookbackDate = () => {
  const dateToday = new Date();
  const fromDate = dateToday.setDate(dateToday.getDate() - 3);
  const fromDateInMS = new Date(fromDate);
  const day = fromDateInMS.getDate();
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
  let { results } = await fetchNewContent();
  results = CatalogItems.check(results); // type-check api response
  const newContent: CatalogItem[] = results;
  const itemsNotAddedToDb: Pick<CatalogItem, 'nfid' | 'title'>[] = [];

  for (let i = 0; i < newContent.length; i++) {
    const item = newContent[i];
    const { error } = await supabaseService.from('catalog').insert({
      nfid: item.nfid,
      title: decodeHTML(item.title),
      img: item.img,
      vtype: item.vtype,
      synopsis: decodeHTML(item.synopsis),
      year: item.year,
      runtime: item.runtime,
      imdbid: item.imdbid,
      rating: item.imdbrating === 0 ? null : item.imdbrating,
      titledate: item.titledate,
    });

    if (error) {
      itemsNotAddedToDb.push({
        nfid: item.nfid,
        title: decodeHTML(item.title),
      });
      console.log('Error:', {
        message: error.message,
        details: error.details,
      });
    }
  }

  return itemsNotAddedToDb.length === 0
    ? { success: 201 }
    : { Error: [...itemsNotAddedToDb] };
};

const apiResponse = async (req: NextApiRequest, res: NextApiResponse) => {
  await addNewContentToDB();
  res.redirect('/api/cron/rating');
};

export default apiResponse;
