import { Genre, UnogsGenres } from './types';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@src/types/supabase';
import { Env } from './index';
import { ValidationError } from 'runtypes';

type TitleGenres =
  | Awaited<
      | { genre_nfid: number; genre: string; catalog_nfid: number }[]
      | { genre_nfid: null; genre: null; catalog_nfid: number }
    >[]
  | null;

async function getCatalogFromDB(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from('catalog')
    .select('nfid')
    .eq('genre', 'false')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error:', {
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

  const titleGenres: TitleGenres = await Promise.all(
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
        console.error('item', item);
        if (error instanceof ValidationError)
          console.error('Error validating genre api types:', {
            code: error.code,
            stack: error.stack,
          });
      }

      return apiResults.results
        ? apiResults.results.map((genre) => {
            return {
              catalog_nfid: item.nfid,
              genre: genre.genre,
              genre_nfid: genre.nfid,
            };
          })
        : { catalog_nfid: item.nfid, genre: null, genre_nfid: null };
    })
  );

  return titleGenres;
}

async function addGenresToDb(
  titleGenres:
    | Awaited<
        | { genre_nfid: number; genre: string; catalog_nfid: number }[]
        | { genre_nfid: null; genre: null; catalog_nfid: number }
      >[]
    | null,
  supabase: SupabaseClient<Database>
) {
  if (!titleGenres) {
    return null;
  }

  const flatUniqueTitleGenres = titleGenres
    .flat()
    .filter((title) => title.genre_nfid)
    .filter(
      (genre, index, self) =>
        index ===
        self.findIndex(
          (nfid) =>
            nfid.catalog_nfid === genre.catalog_nfid &&
            nfid.genre_nfid === genre.genre_nfid
        )
    );
  const removedDuplicateGenres = [...new Set(flatUniqueTitleGenres)];
  const { error } = await supabase
    .from('catalog_genre')
    .insert([...removedDuplicateGenres]);

  if (error) {
    console.error('Error adding genres to db:', {
      message: error.message,
      details: error.details,
    });
    return null;
  }

  return Array.from(
    new Set(flatUniqueTitleGenres.map((title) => title.catalog_nfid))
  );
}

async function markCatalogGenreTrue(
  titleNfids: number[] | null,
  supabase: SupabaseClient
) {
  if (!titleNfids) {
    return null;
  }

  for (const titleNfid of titleNfids) {
    const { error } = await supabase
      .from('catalog')
      .update({ genre: true })
      .eq('nfid', titleNfid);

    if (error) {
      console.error('Error updating catalog title genre column:', {
        message: error.message,
        details: error.details,
      });
    }
  }

  return { titlesWithGenresAdded: titleNfids };
}

const genreUpdate = {
  async fetch(req: Request, env: Env, supabase: SupabaseClient) {
    const catalog = await getCatalogFromDB(supabase);
    const genres = await getGenres(catalog, env);
    const genresAdded = await addGenresToDb(genres, supabase);
    const updatedCatalogTitles = await markCatalogGenreTrue(
      genresAdded,
      supabase
    );

    const response = {
      updatedTitleNfids: updatedCatalogTitles,
    };

    return new Response(JSON.stringify(response), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
};

export default genreUpdate;
