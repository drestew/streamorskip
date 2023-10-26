import { decodeHTML } from 'entities';
import { RemovedTitles, RemovedTitle } from './types';
import { ValidationError } from 'runtypes';
import { lookbackDate } from './addToCatalog';
import { Env } from './index';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@src/types/supabase';

const fetchRemovedTitles = async (env: Env) => {
  let removedTitles: RemovedTitle;
  const url = `https://unogsng.p.rapidapi.com/titlesdel?offset=0&countrylist=78&date=${lookbackDate()}`;
  const mediaData = await fetch(url, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': env.CATALOG_KEY,
      'X-RapidAPI-Host': env.CATALOG_HOST,
    },
  });
  removedTitles = await mediaData.json();
  try {
    // type-check api response
    removedTitles = RemovedTitles.check(removedTitles);
  } catch (error) {
    if (error instanceof ValidationError)
      console.error('Error validating removed titles from unogs api:', {
        code: error.code,
        stack: error.stack,
      });
  }
  return removedTitles;
};

const markRemovedTitles = async (
  removedTitles: RemovedTitle,
  supabase: SupabaseClient
) => {
  type TitleBrief = { nfid: number; title: string };
  const itemsNotMarkedAsRemoved: TitleBrief[] = [];
  const itemsMarkedAsRemoved: TitleBrief[] = [];

  for (let i = 0; i < removedTitles.results.length; i++) {
    const item: { netflixid: number; title: string } = removedTitles.results[i];
    const { data, error } = await supabase
      .from('catalog')
      .update({
        on_Nflix: false,
      })
      .eq('nfid', item.netflixid)
      .select();

    if (data && data.length > 0) {
      itemsMarkedAsRemoved.push({
        nfid: data[0].nfid,
        title: data[0].title,
      });
    } else {
      itemsNotMarkedAsRemoved.push({
        nfid: item.netflixid,
        title: decodeHTML(item.title),
      });
    }

    if (error) {
      console.log('Error:', {
        message: error.message,
        details: error.details,
      });
    }
  }

  return {
    noLongerOnNflix: [...itemsMarkedAsRemoved],
    Error: [...itemsNotMarkedAsRemoved],
  };
};

const removeFromCatalog = {
  async fetch(req: Request, env: Env) {
    const supabaseUrl = env.SUPABASE_URL;
    const supabaseKey = env.SUPABASE_KEY;
    const supabase = createClient<Database>(supabaseUrl, supabaseKey);

    const removedTitles = await fetchRemovedTitles(env);
    const markedTitles = await markRemovedTitles(removedTitles, supabase);

    return new Response(JSON.stringify(markedTitles), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
};

export default removeFromCatalog;
