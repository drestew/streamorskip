import { decodeHTML } from 'entities';
import { RemovedTitles, RemovedTitle } from './types';
import { ValidationError } from 'runtypes';
import { date3DaysAgo } from './addToCatalog';
import { Env } from './index';
import { SupabaseClient } from '@supabase/supabase-js';

const fetchRemovedTitles = async (env: Env) => {
  let removedTitles: RemovedTitle;
  const url = `https://unogsng.p.rapidapi.com/titlesdel?offset=0&countrylist=78&date=${date3DaysAgo()}`;
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

  if (!removedTitles.results) {
    return null;
  }

  for (const removedTitle of removedTitles.results) {
    const { data, error } = await supabase
      .from('catalog')
      .update({
        on_Nflix: false,
      })
      .eq('nfid', removedTitle.netflixid)
      .select();

    if (data && data.length > 0) {
      itemsMarkedAsRemoved.push({
        nfid: data[0].nfid,
        title: data[0].title,
      });
    } else {
      itemsNotMarkedAsRemoved.push({
        nfid: removedTitle.netflixid,
        title: decodeHTML(removedTitle.title),
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
  async fetch(req: Request, env: Env, supabase: SupabaseClient) {
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
