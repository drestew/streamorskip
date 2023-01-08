import { Number, String, Record, Array, Null, Union, Static } from 'runtypes';

const CatalogItem = Record({
  id: Number,
  title: String,
  img: String,
  vtype: String,
  nfid: Number,
  synopsis: String,
  avgrating: Union(Number, Null),
  year: Number,
  runtime: Union(Number, Null),
  imdbid: Union(String, Null),
  poster: Union(String, Null),
  imdbrating: Union(Number, Null),
  top250: Union(Number, Null),
  top250tv: Union(Number, Null),
  clist: String,
  titledate: String,
});

export const CatalogItems = Array(CatalogItem);
export type CatalogItem = Static<typeof CatalogItem>;

const histogram = Record({
  aggregateRating: Number,
  demographic: String,
  histogram: Record({
    ['1']: Number,
    ['2']: Number,
    ['3']: Number,
    ['4']: Number,
    ['5']: Number,
    ['6']: Number,
    ['7']: Number,
    ['8']: Number,
    ['9']: Number,
    ['10']: Number,
  }),
  totalRatings: Number,
});

const ImdbRatingItem = Record({
  ['@type']: String,
  id: String,
  title: String,
  titleType: String,
  year: Number,
  canRate: Number,
  rating: Number,
  ratingCount: Number,
  ratingHistograms: Record({
    ['US users']: histogram,
    ['Males Aged 30-44']: histogram,
    ['Females']: histogram,
    ['Males']: histogram,
    ['Females Aged 45+']: histogram,
    ['IMDb Users']: histogram,
    ['Males Aged 45+']: histogram,
    ['Aged 18-29']: histogram,
    ['Aged 30-44']: histogram,
    ['Aged 45+']: histogram,
    ['Non-US users']: histogram,
    ['Males Aged 18-29']: histogram,
  }),
});

export const ImdbRatingItems = Array(ImdbRatingItem);
export type ImdbRatingItem = Static<typeof ImdbRatingItem>;
