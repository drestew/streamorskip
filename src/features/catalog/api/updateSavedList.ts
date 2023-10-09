import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@src/types/supabase';

export async function updateSavedList(
  supabase: SupabaseClient<Database>,
  userId: string | null,
  nfid: number,
  savedToList: boolean | null
) {
  if (userId) {
    if (!savedToList && savedToList !== null) {
      const { error: addError } = await supabase.from('saved_list').insert({
        user_item_key: `${userId}-${nfid}`,
        user_id: userId,
        catalog_item: nfid,
      });

      if (addError) {
        console.log('Error adding to saved list:', {
          message: addError.message,
          details: addError.details,
        });
      }
    }

    if (savedToList) {
      const { error: deleteError } = await supabase
        .from('saved_list')
        .delete()
        .eq('user_item_key', `${userId}-${nfid}`);

      if (deleteError) {
        console.log('Error deleting from saved list:', {
          message: deleteError.message,
          details: deleteError.details,
        });
      }
    }
  }
}
