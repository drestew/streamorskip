import { supabaseService } from '@utils/supabase';
import { options } from '@utils/imdb';
import { ImdbIdItem, ImdbIdItems } from '../types';
import { NextApiRequest, NextApiResponse } from 'next';
import { ValidationError } from 'runtypes';

type NeedRating = Awaited<ReturnType<typeof getNullRatingsFromDB>>;
type UpdatedRating = {
  title: string | null;
  imdbId: string | null;
};
export default apiResponse;
async function apiResponse(req: NextApiRequest, res: NextApiResponse) {
  const resp = await updateCatalogRatings();
  res.json(resp);
}

async function updateCatalogRatings() {
  let updatedCatalogItems: {
    itemsWithRatingAdded: UpdatedRating[];
    itemsWithRatingsNotAdded: UpdatedRating[];
  } = { itemsWithRatingAdded: [], itemsWithRatingsNotAdded: [] };

  for (let i = 0; i < 10; i += 2) {
    const nullRatings = await getNullRatingsFromDB(i);
    const ratedItems = await getRatings(nullRatings);
    updatedCatalogItems = await addRatingsToDB(ratedItems);
  }
  return updatedCatalogItems;
}

async function getNullRatingsFromDB(i: number) {
  const { data, error } = await supabaseService
    .from('catalog')
    .select('title, imdbid, rating, nfid')
    .eq('on_Nflix', true)
    .or('rating.is.null, rating.eq.0')
    .not('imdbid', 'is', null)
    .order('id', { ascending: false })
    .range(0, i + 2);

  if (error) {
    console.log('Error:', {
      message: error.message,
      details: error.details,
    });
  }

  return data;
}

async function getRatings(catalogFromDB: Awaited<NeedRating>) {
  let itemsToBeRated: (string | null)[];
  let itemsWithRatings: ImdbIdItem[] = [];

  if (catalogFromDB && catalogFromDB.length > 0) {
    itemsToBeRated = catalogFromDB.map((item) => item.imdbid);
    itemsWithRatings = await Promise.all(
      itemsToBeRated.map(async (item) => {
        const url = `https://imdb-api.com/en/API/UserRatings/k_27mlvrca/${item}`;
        const fetchItemRatings = await fetch(url, options);
        return fetchItemRatings.json();
      })
    );
  }
  return itemsWithRatings;
}

async function addRatingsToDB(ratedItemsPromise: Awaited<ImdbIdItem[]>) {
  let ratedItems = ratedItemsPromise;
  const itemsWithAddedRating: UpdatedRating[] = [];
  const itemsWithNoRating: UpdatedRating[] = [];
  try {
    ratedItems = ImdbIdItems.check(ratedItems);
    ratedItems.map(async (item) => {
      if (item.totalRatingVotes === '0') {
        itemsWithNoRating.push({
          title: item.title,
          imdbId: item.imDbId,
        });
        return;
      }

      const { error } = await supabaseService
        .from('catalog')
        .update({
          rating: Number(item.totalRating),
        })
        .eq('imdbid', item.imDbId);

      if (error) {
        console.log('Error:', {
          message: error.message,
          details: error.details,
        });
      }

      itemsWithAddedRating.push({
        title: item.title,
        imdbId: item.imDbId,
      });
    });
  } catch (error) {
    // console.log(ratedItems);
    if (error instanceof ValidationError)
      console.error('Error validating imdb api types:', {
        code: error.code,
        details: error.details,
      });
  }

  return {
    itemsWithRatingAdded: itemsWithAddedRating,
    itemsWithRatingsNotAdded: itemsWithNoRating,
  };
}
