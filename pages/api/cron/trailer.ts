import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseService } from '../../../utils/supabase';
import { options } from '../../../utils/imdb';
import { TrailerItem, TrailerItems, TrailerUrl, TrailerUrls } from './types';
import { ValidationError } from 'runtypes';
import { throttle } from 'lodash';

type TrailerId = {
  imdbid: string;
  trailerId: string;
};

type TrailerUrlDB = {
  imdbid: string;
  trailerUrl: string;
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

const addTrailersToDB = async () => {
  const trailers = await getVideoUrl();

  if (trailers) {
    trailers.map(async (trailer) => {
      const { error } = await supabaseService
        .from('catalog')
        .update({
          trailer: trailer.trailerUrl || null,
        })
        .eq('imdbid', trailer.imdbid);

      if (error) console.error(error);
    });
  }
};

const getVideoUrl = throttle(async () => {
  const trailerIds = await getTrailerId();
  let trailerForDB: TrailerUrlDB;

  if (trailerIds) {
    const itemsWithTrailer: TrailerUrlDB[] = await Promise.all(
      trailerIds.map(async (item) => {
        const url = `https://imdb8.p.rapidapi.com/title/get-video-playback?viconst=${item.trailerId}&region=US`;
        const trailerUrls = await fetch(url, options);
        let trailerResponse: TrailerUrl = await trailerUrls.json();

        try {
          trailerResponse = TrailerUrls.check(trailerResponse);
          const mp4 = trailerResponse.resource.encodings.filter(
            (item) => item.mimeType === 'video/mp4'
          );
          trailerForDB = { imdbid: item.imdbid, trailerUrl: mp4[0].playUrl };
        } catch (error) {
          if (error instanceof ValidationError)
            console.error('Error:', {
              code: error.code,
              details: error.details,
              message: error.message,
            });
        }
        return trailerForDB;
      })
    );

    return itemsWithTrailer;
  }
}, 400);

const getTrailerSource = throttle(async () => {
  const nullTrailers = await getNullTrailersFromDB();
  let trailerItems: TrailerItem[] = [];

  if (nullTrailers) {
    trailerItems = await Promise.all(
      nullTrailers.map(async (item) => {
        const url = `https://imdb8.p.rapidapi.com/title/get-videos?tconst=${item.imdbid}&region=US`;
        const fetchTrailers = await fetch(url, options);
        let trailerResponse: TrailerItem = await fetchTrailers.json();
        console.log(trailerResponse);
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
}, 400);

const getTrailerId = async () => {
  const trailerSource = await getTrailerSource();
  let newItem: TrailerId;
  if (trailerSource) {
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
  }
  return trailerSource;
};

const apiResponse = async (req: NextApiRequest, res: NextApiResponse) => {
  const results = await addTrailersToDB();
  res.json(results);
};

export default apiResponse;
