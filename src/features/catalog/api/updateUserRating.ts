import { User } from '@supabase/gotrue-js';
import { SupabaseClient } from '@supabase/supabase-js';

export async function deleteUserRating(
  nfid: number,
  user: User,
  supabaseClient: SupabaseClient
) {
  if (user) {
    const { error } = await supabaseClient
      .from('rating')
      .delete()
      .eq('user_item_key', `${user?.id}-${nfid}`);

    if (error) {
      console.log('Error:', {
        message: error.message,
        details: error.details,
      });
    }
  }
}
export async function updateUserRating(
  nfid: number,
  stream: boolean,
  user: User,
  supabaseClient: SupabaseClient
) {
  if (user) {
    const { error } = await supabaseClient.from('rating').upsert({
      user_item_key: `${user.id}-${nfid}`,
      user_id: user.id,
      catalog_item: nfid,
      stream: stream,
    });

    if (error) {
      console.log('Error:', {
        message: error.message,
        details: error.details,
      });
    }
  }
}
