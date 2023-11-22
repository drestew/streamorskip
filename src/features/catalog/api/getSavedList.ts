import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@src/types/supabase';

export async function getSavedList(
  { pageParam = 0 },
  supabase: SupabaseClient<Database>,
  userId: string | null
) {
  if (!userId) return null;
  const step = pageParam + 10;
  const { data: titles, error: titlesError } = await supabase
    .from('saved_list')
    .select('catalog_item')
    .eq('user_id', userId);

  if (titlesError) {
    console.log('Error getting saved list nfids:', {
      message: titlesError.message,
      details: titlesError.details,
    });
  }

  const titleIds = titles?.map((title) => title.catalog_item);

  const { data: usersList, error: userListError } = await supabase
    .from('catalog')
    .select(
      'nfid, title, img, synopsis, rating, vtype, on_Nflix, stream_count, skip_count, trailer'
    )
    .in('nfid', titleIds || [])
    .range(pageParam, step);

  if (userListError) {
    console.log('Error getting saved list catalog:', {
      message: userListError.message,
      details: userListError.details,
    });
  }

  return {
    filteredData: usersList || null,
    step: usersList && usersList.length > 0 ? step + 1 : null,
  };
}
