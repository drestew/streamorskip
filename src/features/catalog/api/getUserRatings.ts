import { supabaseClient } from '@utils/supabase-client';
import { useQuery } from '@tanstack/react-query';

async function getUserRatings() {
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
  const { data, status } = useQuery({
    queryKey: ['userRatings'],
    queryFn: getUserRatings,
  });

  return { data, status };
}