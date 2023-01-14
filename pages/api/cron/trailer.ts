import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseService } from '../../../utils/supabase';
import { options } from '../../../utils/imdb';
import { TrailerItem, TrailerItems } from './types';
import { ValidationError } from 'runtypes';

type TrailerId = {
  imdbid: string;
  trailerId: string;
};

const getNullTrailersFromDB = async () => {
  const { data, error } = await supabaseService
    .from('catalog')
    .select('imdbid, trailer')
    .is('trailer', null)
    .not('imdbid', 'is', null);

  if (error) {
    console.log('Error:', {
      message: error.message,
      details: error.details,
    });
  }

  return data;
};

const getTrailerSource = async () => {
  const nullTrailers = await getNullTrailersFromDB();
  let trailerItems: TrailerItem[] = [];

  if (nullTrailers) {
    trailerItems = await Promise.all(
      nullTrailers.map(async (item) => {
        const url = `https://imdb8.p.rapidapi.com/title/get-videos?tconst=${item.imdbid}&region=US`;
        const fetchTrailers = await fetch(url, options);
        let trailerResponse: TrailerItem = await fetchTrailers.json();

        try {
          trailerResponse = TrailerItems.check(trailerResponse);
        } catch (error) {
          if (error instanceof ValidationError)
            console.error('Error:', {
              code: error.code,
              details: error.details,
              message: error.message,
            });
        }

        return trailerResponse;
      })
    );
  }

  return trailerItems;
};

const getTrailerId = async () => {
  const trailerSource = await getTrailerSource();
  let newItem: TrailerId;

  return trailerSource
    .map((item) => {
      if (item.resource?.videos) {
        const imdbId = item.resource.id.replace(/\D/g, '');
        const trailerId = item.resource.videos[0].id.slice(9);
        newItem = {
          imdbid: `tt${imdbId}`,
          trailerId: trailerId,
        };
      }
      return newItem;
    })
    .filter((item) => item);
};

const apiResponse = async (req: NextApiRequest, res: NextApiResponse) => {
  const results = await getTrailerId();
  res.json(results);
};

export default apiResponse;
