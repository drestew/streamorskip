import { supabaseClient } from '@utils/supabase-client';

async function searchGenre(genre: string) {
  const { data, error } = await supabaseClient
    .from('catalog_genre')
    .select()
    .textSearch('genre', genre, {
      type: 'websearch',
      config: 'english',
    });

  if (error) {
    console.log('Error: searchGenre()', {
      message: error.message,
      details: error.details,
    });
  }

  return Array.from(new Set(data?.map((item) => item.catalog_nfid)));
}
export async function getCatalog(
  { pageParam = 0 },
  category: string,
  genre: string
) {
  const step = pageParam + 10;
  const nfidSet = await searchGenre(genre);
  let filteredData;

  const { data, error } = await supabaseClient
    .from('catalog')
    .select(
      'nfid, title, img, synopsis, rating, vtype, on_Nflix, catalog_genre!inner(genre)'
    )
    .is('on_Nflix', true)
    .neq('rating', 0)
    .eq('vtype', category)
    .in('nfid', nfidSet)
    .range(pageParam, step);

  filteredData = data;

  if (error) {
    console.log('Error:', {
      message: error.message,
      details: error.details,
    });
  }

  if (data?.length === 0) {
    const { data, error } = await supabaseClient
      .from('catalog')
      .select(
        'nfid, title, img, synopsis, rating, vtype, on_Nflix, catalog_genre!inner(genre)'
      )
      .is('on_Nflix', true)
      .neq('rating', 0)
      .eq('vtype', category)
      .range(pageParam, step);

    filteredData = data;

    if (error) {
      console.log('Error: getCala', {
        message: error.message,
        details: error.details,
      });
    }
  }

  return { filteredData, step: step + 1 };
}
