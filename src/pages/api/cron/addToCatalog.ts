import { decodeHTML } from 'entities';
import { CatalogItem, CatalogItems } from './types';
import { ValidationError } from 'runtypes';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@src/types/supabase';
import { Env } from './index';

export const lookbackDate = () => {
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
  const url = `https://unogsng.p.rapidapi.com/search?newdate=${lookbackDate()}
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
    console.log(apiResults);
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
    for (let i = 0; i < fetchedTitles.results.length; i++) {
      const item = fetchedTitles.results[i];
      const { error } = await supabase.from('catalog').insert({
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

      titlesAddedToDb.push({
        nfid: item.nfid,
        title: decodeHTML(item.title),
      });

      if (error) {
        titlesNotAddedToDb.push({
          nfid: item.nfid,
          title: decodeHTML(item.title),
        });
        console.log('Error:', {
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

  return { titlesAdded: [...titlesAddedToDb], Error: [...titlesNotAddedToDb] };
}

const addToCatalog = {
  async fetch(req: Request, env: Env) {
    const supabaseUrl = env.SUPABASE_URL;
    const supabaseKey = env.SUPABASE_KEY;
    const supabase = createClient<Database>(supabaseUrl, supabaseKey);

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
