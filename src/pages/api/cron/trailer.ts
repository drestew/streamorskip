import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseService } from '@utils/supabase';
import { options } from '@utils/imdb';
import { TrailerItem, TrailerItems, TrailerUrl, TrailerUrls } from './types';
import { ValidationError } from 'runtypes';
import Bottleneck from 'bottleneck';

type TrailerId = {
  imdbid: string;
  trailerId: string;
};

type TrailerUrlDB = {
  imdbid: string;
  trailerUrl: string;
};

const limiter = new Bottleneck({ minTime: 300 });

const getNullTrailersFromDB = async () => {
  const { data, error } = await supabaseService
    .from('catalog')
    .select('imdbid, trailer')
    .is('trailer', null)
    .not('imdbid', 'is', null);

  if (error) {
    console.error('Error:', {
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
          trailer: trailer?.trailerUrl || null,
        })
        .eq('imdbid', trailer.imdbid);

      if (error) console.error(error);
    });
  }

  return { trailers: trailers };
};

const getVideoUrl = async () => {
  const trailerIds = await getTrailerId();
  let trailerForDB: TrailerUrlDB;

  if (trailerIds) {
    const itemsWithTrailer: Promise<TrailerUrlDB>[] = trailerIds.map(
      async (item) => {
        const url = `https://imdb8.p.rapidapi.com/title/get-video-playback?viconst=${item.trailerId}&region=US`;
        const trailerUrls = await limiter.schedule(() => fetch(url, options));
        let trailerResponse: TrailerUrl = await trailerUrls.json();

        try {
          trailerResponse = TrailerUrls.check(trailerResponse);
          if (trailerResponse.resource) {
            const mp4 = trailerResponse.resource.encodings.filter(
              (item) => item.mimeType === 'video/mp4'
            );
            trailerForDB = {
              imdbid: item.imdbid,
              trailerUrl: mp4[0].playUrl,
            };
          }
        } catch (error) {
          if (error instanceof ValidationError)
            console.error('Error: trailerUrls', {
              code: error.code,
              details: error.details,
              message: error.message,
            });
        }

        return trailerForDB;
      }
    );

    return await Promise.all(itemsWithTrailer.map((item) => item));
  }
};

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
      .filter(
        (item, index, arr) =>
          item &&
          index ===
            arr.findIndex(
              (itemForIndex) => item.imdbid === itemForIndex?.imdbid
            )
      );
  }
  return trailerSource;
};

const getTrailerSource = async () => {
  const nullTrailers = await getNullTrailersFromDB();
  let trailerItems: Promise<TrailerItem>[] = [];

  if (nullTrailers) {
    trailerItems = nullTrailers
      .map(async (item) => {
        const url = `https://imdb8.p.rapidapi.com/title/get-videos?tconst=${item.imdbid}&region=US`;
        const fetchTrailers = await limiter.schedule(() => fetch(url, options));
        let trailerResponse: TrailerItem = await fetchTrailers.json();

        try {
          trailerResponse = TrailerItems.check(trailerResponse);
        } catch (error) {
          if (error instanceof ValidationError)
            console.error('Error: trailerItems', {
              code: error.code,
              details: error.details,
              message: error.message,
            });
        }

        return trailerResponse;
      })
      .filter((item) => item);
  }

  return await Promise.all(trailerItems.map((item) => item));
};

const apiResponse = async (req: NextApiRequest, res: NextApiResponse) => {
  const resp = await addTrailersToDB();
  res.json(resp);
};

export default apiResponse;
