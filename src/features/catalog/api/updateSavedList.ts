import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@src/types/supabase';

export async function updateSavedList(
  supabase: SupabaseClient<Database>,
  userId: string | undefined,
  nfid: number
) {
  if (userId) {
    const { error } = await supabase.from('saved_list').insert({
      user_item_key: `${userId}-${nfid}`,
      user_id: userId,
      catalog_item: nfid,
    });

    if (error) {
      console.log('Error:', {
        message: error.message,
        details: error.details,
      });
    }
  }
}
