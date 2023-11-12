import { supabaseClient } from '@utils/supabase-client';
import { useQuery } from '@tanstack/react-query';
import { useFilters } from '@features/filters';

async function getGenreList() {
  const { data, error } = await supabaseClient
    .from('genre')
    .select('genre, id, movie, series');

  if (error) {
    console.log('Error:', {
      message: error.message,
      details: error.details,
    });
  }

  return data;
}

export function useGenreList() {
  const { filters } = useFilters();
  const { data } = useQuery({
    queryKey: ['genreList'],
    queryFn: getGenreList,
  });

  const filteredGenre = data?.filter((genre) =>
    filters.category === 'movie' ? genre.movie : genre.series
  );

  return { filteredGenre };
}
