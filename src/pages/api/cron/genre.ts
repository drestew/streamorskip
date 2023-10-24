import { Genre, UnogsGenres } from './types';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@src/types/supabase';
import { Env } from './index';
import { ValidationError } from 'runtypes';

type TitleGenres = { catalog_nfid: number; genre: string; genre_nfid: number };

async function getCatalogFromDB(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from('catalog')
    .select('nfid')
    .eq('genre', 'false')
    .range(0, 50);

  if (error) {
    console.log('Error:', {
      message: error.message,
      details: error.details,
    });
  }

  return data;
}

async function getGenres(catalog: { nfid: number }[] | null, env: Env) {
  let apiResults: Genre;

  if (!catalog) {
    return null;
  }

  const titleGenres: TitleGenres[][] = await Promise.all(
    catalog.map(async (item) => {
      const url = `https://unogsng.p.rapidapi.com/titlegenres?netflixid=${item.nfid}`;
      const fetchGenres = await fetch(url, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': env.CATALOG_KEY,
          'X-RapidAPI-Host': env.CATALOG_HOST,
        },
      });
      apiResults = await fetchGenres.json();
      try {
        apiResults = UnogsGenres.check(apiResults);
      } catch (error) {
        if (error instanceof ValidationError)
          console.error('Error validating genre api types:', {
            code: error.code,
            details: error.details,
          });
      }

      return apiResults.results.map((genre) => {
        return {
          catalog_nfid: item.nfid,
          genre: genre.genre,
          genre_nfid: genre.nfid,
        };
      });
    })
  );

  return titleGenres;
}

async function addGenresToDb(
  titleGenres: TitleGenres[][] | null,
  supabase: SupabaseClient<Database>
) {
  if (!titleGenres) {
    return null;
  }

  const flatTitleGenres = titleGenres.flat();
  const { error } = await supabase
    .from('catalog_genre')
    .insert([...flatTitleGenres]);

  if (error) {
    console.log('Error adding genres to db:', {
      message: error.message,
      details: error.details,
    });
  }

  const titleSet: number[] = Array.from(
    new Set(flatTitleGenres.map((title) => title.catalog_nfid))
  );

  // async map function does not work with db call
  for (const titleNfid of titleSet) {
    const { error } = await supabase
      .from('catalog')
      .update({ genre: true })
      .eq('nfid', titleNfid);

    if (error) {
      console.log('Error updating catalog title genre column:', {
        message: error.message,
        details: error.details,
      });
    }
  }

  return { titlesWithGenresAdded: titleSet, genresAdded: titleGenres };
}

const genreUpdate = {
  async fetch(req: Request, env: Env) {
    const supabaseUrl = env.SUPABASE_URL;
    const supabaseKey = env.SUPABASE_KEY;
    const supabase = createClient<Database>(supabaseUrl, supabaseKey);

    const catalog = await getCatalogFromDB(supabase);
    const genres = await getGenres(catalog, env);
    const genresAdded = await addGenresToDb(genres, supabase);

    return new Response(JSON.stringify(genresAdded), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
};

export default genreUpdate;
