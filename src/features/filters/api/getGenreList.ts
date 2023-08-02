import { supabaseClient } from '@utils/supabase-client';
import { useQuery } from '@tanstack/react-query';

async function getGenreList() {
  const { data, error } = await supabaseClient
    .from('genre')
    .select('genre, id');

  if (error) {
    console.log('Error:', {
      message: error.message,
      details: error.details,
    });
  }

  return data;
}

export function useGenreList() {
  const { data } = useQuery({
    queryKey: ['genreList'],
    queryFn: getGenreList,
  });

  return { data };
}
