import { useQuery } from '@tanstack/react-query';
import { supabaseClient } from '@utils/supabase-client';

async function getCatalog() {
  const { data, error } = await supabaseClient
    .from('catalog')
    .select('nfid, title, img, synopsis, rating, vtype, on_Nflix')
    .is('on_Nflix', true);

  if (error) {
    console.log('Error:', {
      message: error.message,
      details: error.details,
    });
  }

  return data;
}
export function useCatalog() {
  return useQuery(['catalog-default'], getCatalog);
}
