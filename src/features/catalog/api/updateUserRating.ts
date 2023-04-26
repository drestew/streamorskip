import { supabaseClient } from '@utils/supabase-client';

async function getUser() {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  return user;
}
export async function deleteUserRating(nfid: number) {
  const user = await getUser();
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
export async function updateUserRating(nfid: number, stream: boolean) {
  const user = await getUser();
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
