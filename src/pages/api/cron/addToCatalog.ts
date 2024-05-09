import { decodeHTML } from 'entities';
import { CatalogItem, CatalogItems } from './types';
import { ValidationError } from 'runtypes';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@src/types/supabase';
import { Env } from './index';

export const date3DaysAgo = () => {
  const dateToday = new Date();
  const fromDate = dateToday.setDate(dateToday.getDate() - 3);
  const fromDateInMS = new Date(fromDate);
  const day = fromDateInMS.getDate();
  const month = fromDateInMS.getMonth() + 1;
  const year = fromDateInMS.getFullYear();

  return `${year}-${month}-${day}`;
};

async function getNewTitles(env: Env) {
  let apiResults: CatalogItem;
  const url = `https://unogsng.p.rapidapi.com/search?newdate=${date3DaysAgo()}
  &audiosubtitle_andor=and&subtitle=english&countrylist=78&audio=english&offset=0`;
  const newTitles = await fetch(url, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': env.CATALOG_KEY,
      'X-RapidAPI-Host': env.CATALOG_HOST,
    },
  });
  apiResults = await newTitles.json();
  try {
    // type-check api response
    apiResults = CatalogItems.check(apiResults);
  } catch (error) {
    if (error instanceof ValidationError)
      console.error('Error validating unogs catalog api types:', {
        code: error.code,
        stack: error.stack,
      });
  }

  return apiResults;
}

async function addNewTitlesToDB(
  fetchedTitles: CatalogItem,
  env: Env,
  supabase: SupabaseClient<Database>
) {
  type TitleBrief = { nfid: number; title: string };
  const titlesNotAddedToDb: TitleBrief[] = [];
  const titlesAddedToDb: TitleBrief[] = [];

  try {
    for (const title of fetchedTitles.results) {
      const { error } = await supabase.from('catalog').insert({
        nfid: title.nfid,
        title: decodeHTML(title.title),
        img: title.img,
        vtype: title.vtype,
        synopsis: decodeHTML(title.synopsis),
        year: title.year,
        runtime: title.runtime,
        imdbid: title.imdbid,
        rating: title.imdbrating === 0 ? null : title.imdbrating,
        titledate: title.titledate,
      });

      titlesAddedToDb.push({
        nfid: title.nfid,
        title: decodeHTML(title.title),
      });

      if (error) {
        titlesNotAddedToDb.push({
          nfid: title.nfid,
          title: decodeHTML(title.title),
        });
        console.log('Error title not added to db:', {
          message: error.message,
          details: error.details,
        });
      }
    }
  } catch (error) {
    // will throw error if duplicate primary key (nfid) in db
    if (error instanceof ValidationError)
      console.error('Error:', {
        code: error.code,
        details: error.details,
      });
  }

  return {
    titlesAdded: [...titlesAddedToDb],
    titlesNotAdded: [...titlesNotAddedToDb],
  };
}

const addToCatalog = {
  async fetch(req: Request, env: Env, supabase: SupabaseClient) {
    const fetchedTitles = await getNewTitles(env);
    const newTitles = await addNewTitlesToDB(fetchedTitles, env, supabase);

    return new Response(JSON.stringify(newTitles), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
};
export default addToCatalog;
