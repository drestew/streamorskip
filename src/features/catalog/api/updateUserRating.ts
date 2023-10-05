import { User } from '@supabase/gotrue-js';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@src/types/supabase';

export async function deleteUserRating(
  nfid: number,
  user: User | null,
  supabase: SupabaseClient<Database>
) {
  if (user) {
    const { error } = await supabase
      .from('rating')
      .delete()
      .eq('user_item_key', `${user?.id}-${nfid}`);

    if (error) {
      console.log('Error deleting rating:', {
        message: error.message,
        details: error.details,
      });
    }
  }
}

export async function updateUserRating(
  nfid: number,
  userRating: boolean | null,
  user: User | null,
  supabase: SupabaseClient<Database>
) {
  if (user) {
    if (userRating !== null) {
      const { error } = await supabase.from('rating').upsert({
        user_item_key: `${user.id}-${nfid}`,
        user_id: user.id,
        catalog_item: nfid,
        stream: userRating,
      });

      if (error) {
        console.log('Error updating rating:', {
          message: error.message,
          details: error.details,
        });
      }
    } else if (userRating === null) {
      await deleteUserRating(nfid, user, supabase);
    }
  }
}
