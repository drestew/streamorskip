import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseService } from '../../../utils/supabase';
import { options } from '../../../utils/unogs';
import { decodeHTML } from 'entities';
import { ContentItem, ContentItems } from './types';

const lookbackDate = () => {
  const dateToday = new Date();
  const fromDate = dateToday.setDate(dateToday.getDate() - 1);
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
  results = ContentItems.check(results); // type-check api response
  const newContent: ContentItem = results;
  const itemsNotAddedToDb: any = []; // Pick from ContentItem

  // for (let i = 0; i < newContent.length; i++) {
  //   const item = newContent[i];
  //   const { error } = await supabaseService.from('catalog').insert({
  //     nfid: item.nfid,
  //     title: decodeHTML(item.title),
  //     img: item.img,
  //     vtype: item.vtype,
  //     synopsis: decodeHTML(item.synopsis),
  //     year: item.year,
  //     runtime: item.runtime,
  //     imdbid: item.imdbid,
  //     titledate: item.titledate,
  //   });

  // if (error) {
  //   itemsNotAddedToDb.push({
  //     nfid: item.nfid,
  //     title: decodeHTML(item.title),
  //   });
  //   console.log('Error:', {
  //     message: error.message,
  //     details: error.details,
  //   });
  // }
  //}

  // return itemsNotAddedToDb.length === 0
  //   ? { success: 201 }
  //   : { Error: [...itemsNotAddedToDb] };

  return newContent;
};

const apiResponse = async (req: NextApiRequest, res: NextApiResponse) => {
  const result = await addNewContentToDB();
  res.json(result);
};

export default apiResponse;
