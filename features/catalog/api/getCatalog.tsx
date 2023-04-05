import { supabaseClient } from '@utils/supabase-client';
import { useInfiniteQuery } from '@tanstack/react-query';

async function getCatalog({ pageParam = 0 }) {
  const step = pageParam + 10;

  const { data, error } = await supabaseClient
    .from('catalog')
    .select('nfid, title, img, synopsis, rating, vtype, on_Nflix')
    .is('on_Nflix', true)
    .neq('rating', 0)
    .range(pageParam, 1);

  if (error) {
    console.log('Error:', {
      message: error.message,
      details: error.details,
    });
  }

  // return { data, step: step + 1 };
  return { data };
}

export function useCatalog() {
  const { data, fetchNextPage, status } = useInfiniteQuery({
    queryKey: ['catalog-default'],
    queryFn: getCatalog,
    // getNextPageParam: (lastPage) => lastPage.step,
    getNextPageParam: (lastPage) => lastPage,
  });

  return { data, fetchNextPage, status };
}
