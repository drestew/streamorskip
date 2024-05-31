import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@src/types/supabase';

export async function deleteUserRating(
  nfid: number,
  userId: string | null,
  supabase: SupabaseClient<Database>
) {
  if (userId) {
    const { error } = await supabase
      .from('rating')
      .delete()
      .eq('user_item_key', `${userId}-${nfid}`);

    if (error) {
      console.error('Error deleting rating:', {
        message: error.message,
        details: error.details,
      });
    }
  }
}

export async function updateUserRating(
  nfid: number,
  userRating: boolean | null,
  userId: string | null,
  supabase: SupabaseClient<Database>
) {
  if (userId) {
    if (userRating !== null) {
      const { error } = await supabase.from('rating').upsert({
        user_item_key: `${userId}-${nfid}`,
        user_id: userId,
        catalog_item: nfid,
        stream: userRating,
      });

      if (error) {
        console.error('Error updating rating:', {
          message: error.message,
          details: error.details,
        });
      }
    } else {
      await deleteUserRating(nfid, userId, supabase);
    }
  }
}
