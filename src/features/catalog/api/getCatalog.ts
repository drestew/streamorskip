import { supabaseClient } from '@utils/supabase-client';

export async function getCatalog(
  { pageParam = 0 },
  category: string,
  genre: string
) {
  const step = pageParam + 10;
  // const { data, error } = await supabaseClient
  //   .from('catalog')
  //   .select('nfid, title, img, synopsis, rating, vtype, on_Nflix')
  //   .is('on_Nflix', true)
  //   .neq('rating', 0)
  //   .eq('vtype', category)
  //   .range(pageParam, step);

  const { data, error } = await supabaseClient
    .from('catalog')
    .select(
      'nfid, title, img, synopsis, rating, vtype, on_Nflix, catalog_genre!inner(genre)'
    )
    .is('on_Nflix', true)
    .neq('rating', 0)
    .eq('vtype', category)
    .like('catalog_genre.genre', '%Real%')
    .range(pageParam, step);

  // const { data, error } = await supabaseClient
  //   .from('catalog_genre')
  //   .select('catalog (nfid, title, img, synopsis, rating, vtype, on_Nflix)')
  //   .is('catalog.onNflix', true)
  //   .neq('catalog.rating', 0)
  //   .eq('catalog.vtype', category)
  //   // .textSearch('genre', 'Action')
  //   .range(pageParam, step);

  if (error) {
    console.log('Error:', {
      message: error.message,
      details: error.details,
    });
  }

  return { data, step: step + 1 };
}
