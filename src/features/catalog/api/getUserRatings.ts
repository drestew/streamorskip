import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@src/types/supabase';

export async function getUserRatings(
  { pageParam = 0 },
  supabase: SupabaseClient<Database>,
  userId: string | null,
  value: string
) {
  if (!userId) return null;
  const step = pageParam + 10;
  const { data, error } = await supabase
    .from('rating')
    .select('user_id, catalog_item, stream')
    .eq('user_id', userId)
    .eq('stream', value === 'stream');

  if (error) {
    console.log('Error getting user ratings:', {
      message: error.message,
      details: error.details,
    });
  }

  const titleIds = data?.map((title) => title.catalog_item);

  const { data: userRatingsCatalog, error: userRatingsCatalogError } =
    await supabase
      .from('catalog')
      .select(
        'nfid, title, img, synopsis, rating, vtype, on_Nflix, stream_count, skip_count, trailer'
      )
      .in('nfid', titleIds || [])
      .order('created_at', { ascending: false })

      .range(pageParam, step);

  if (userRatingsCatalogError) {
    console.log('Error getting user ratings catalog:', {
      message: userRatingsCatalogError.message,
      details: userRatingsCatalogError.details,
    });
  }

  return {
    filteredData: userRatingsCatalog || null,
    step: userRatingsCatalog && userRatingsCatalog.length > 0 ? step + 1 : null,
  };
}
