import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';
import { SupabaseClient } from '@supabase/supabase-js';

async function getUserRatings(supabaseClient: SupabaseClient) {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();
  const { data, error } = await supabaseClient
    .from('rating')
    .select('user_id, catalog_item, stream')
    .eq('user_id', user?.id);

  if (error) {
    console.log('Error:', {
      message: error.message,
      details: error.details,
    });
  }

  return data;
}

export function useUserRating() {
  const supabaseClient = useSupabaseClient();
  const { data, status } = useQuery({
    queryKey: ['userRatings'],
    queryFn: () => getUserRatings(supabaseClient),
  });

  return { data, status };
}
