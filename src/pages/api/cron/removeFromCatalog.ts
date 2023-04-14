import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseService } from '@utils/supabase';
import { options } from '@utils/unogs';
import { decodeHTML } from 'entities';
import { DeletedItem, DeletedItems } from './types';
import { ValidationError } from 'runtypes';
import { lookbackDate } from './addToCatalog';

const fetchDeletedContent = async () => {
  const url = `https://unogsng.p.rapidapi.com/titlesdel?offset=0&countrylist=78&date=${lookbackDate()}`;
  const mediaData = await fetch(url, options);

  return mediaData.json();
};

const markAsRemovedContent = async () => {
  let { results } = await fetchDeletedContent();
  type ItemData = Pick<DeletedItem, 'netflixid' | 'title'>;
  const itemsNotMarkedAsRemoved: ItemData[] = [];
  const itemsMarkedAsRemoved: ItemData[] = [];

  try {
    results = DeletedItems.check(results); // type-check api response
    const deletedContent: DeletedItem[] = results;
    for (let i = 0; i < deletedContent.length; i++) {
      const item: Pick<DeletedItem, 'netflixid' | 'title'> = deletedContent[i];
      const { data, error } = await supabaseService
        .from('catalog')
        .update({
          on_Nflix: false,
        })
        .eq('nfid', item.netflixid)
        .select();

      if (data && data.length > 0) {
        itemsMarkedAsRemoved.push({
          netflixid: data[0].nfid,
          title: data[0].title,
        });
      } else {
        itemsNotMarkedAsRemoved.push({
          netflixid: item.netflixid,
          title: decodeHTML(item.title),
        });
      }

      if (error) {
        console.log('Error:', {
          message: error.message,
          details: error.details,
        });
      }
    }
  } catch (error) {
    if (error instanceof ValidationError)
      console.error('Error:', {
        code: error.code,
        details: error.details,
      });
  }

  return {
    onNflixFalse: [...itemsMarkedAsRemoved],
    Error: [...itemsNotMarkedAsRemoved],
  };
};

const apiResponse = async (req: NextApiRequest, res: NextApiResponse) => {
  const resp = await markAsRemovedContent();
  res.json(resp);
};

export default apiResponse;
