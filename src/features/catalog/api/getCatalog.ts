import { supabaseClient } from '@utils/supabase-client';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@src/types/supabase';

async function searchGenre(genre: string) {
  const { data, error } = await supabaseClient
    .from('catalog_genre')
    .select()
    .textSearch('genre', genre, {
      type: 'websearch',
      config: 'english',
    });

  if (error) {
    console.log('Error: searchGenre()', {
      message: error.message,
      details: error.details,
    });
  }

  return Array.from(new Set(data?.map((item) => item.catalog_nfid)));
}

async function getProfileSettings(
  userId: string | null,
  supabase: SupabaseClient
) {
  if (!userId || userId === '') {
    return null;
  }

  const { data, error } = await supabase
    .from('profile')
    .select('filter_rated, filter_saved, filter_removed_content')
    .eq('id', userId)
    .single();

  if (error) {
    console.log('Error getting profile settings:', {
      message: error.message,
      details: error.details,
    });
  }

  return data;
}

export async function getCatalog(
  { pageParam = 0 },
  category: string,
  genre: string,
  search: string,
  userId: string | null,
  supabase: SupabaseClient<Database>
) {
  const step = pageParam + 10;
  const genreNfids = await searchGenre(genre);
  const userSettings = await getProfileSettings(userId, supabase);
  let filteredData;

  let query = supabaseClient
    .from('catalog')
    .select('nfid, title, img, synopsis, rating, vtype, on_Nflix')
    .neq('rating', 0)
    .eq('vtype', category)
    .order('created_at', { ascending: false })
    .range(pageParam, step);

  if (search) {
    query = query.ilike('title', `%${search}%`);
    const { data, error } = await query;
    filteredData = data;

    if (error) {
      console.log('Error getting searched content:', {
        message: error.message,
        details: error.details,
      });
    }
  }

  // when a genre is selected
  if (genreNfids.length > 0 && !search) {
    query = query.eq('vtype', category).in('nfid', genreNfids);
    const { data, error } = await query;
    filteredData = data;

    if (error) {
      console.log('Error getting default catalog', {
        message: error.message,
        details: error.details,
      });
    }
  }

  // default, also to not add unfiltered catalog at the end of the filtered results
  if (!search && genreNfids.length === 0) {
    // removed content is not shown by default unless set by user
    if (!userSettings || userSettings.filter_removed_content) {
      query = query.is('on_Nflix', true);
    }

    const { data, error } = await query;
    filteredData = data;

    if (error) {
      console.log('Error ending catalog after filtered results', {
        message: error.message,
        details: error.details,
      });
    }
  }

  if (userSettings && !search) {
    if (userSettings.filter_rated) {
      const { data: ratedItems } = await supabase
        .from('rating')
        .select('catalog_item')
        .eq('user_id', userId);

      const ratedItemNfids = ratedItems?.map((nfid) => nfid.catalog_item);
      query = query.not('nfid', 'in', `(${ratedItemNfids})`);
      const { data, error } = await query;
      filteredData = data;

      if (error) {
        console.log('Error filtering user rated items', {
          message: error.message,
          details: error.details,
        });
      }
    }

    if (userSettings.filter_saved) {
      const { data: savedItems } = await supabase
        .from('saved_list')
        .select('catalog_item')
        .eq('user_id', userId);

      const savedItemNfids = savedItems?.map((nfid) => nfid.catalog_item);
      query = query.not('nfid', 'in', `(${savedItemNfids})`);
      const { data, error } = await query;
      filteredData = data;

      if (error) {
        console.log('Error filtering user saved items', {
          message: error.message,
          details: error.details,
        });
      }
    }
  }

  return {
    filteredData: filteredData || null,
    step: filteredData && filteredData.length > 0 ? step + 1 : null,
  };
}
