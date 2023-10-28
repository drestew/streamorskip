import {
  Number,
  String,
  Record,
  Array,
  Null,
  Union,
  Static,
  Optional,
} from 'runtypes';

const CatalogItem = Record({
  elapse: Optional(Number),
  total: Optional(Number),
  results: Array(
    Record({
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
    })
  ),
});

export const CatalogItems = CatalogItem;
export type CatalogItem = Static<typeof CatalogItem>;

const ImdbIdItem = Record({
  imDbId: Union(String, Null),
  title: Union(String, Null),
  fullTitle: Union(String, Null),
  type: Union(String, Null),
  year: Union(String, Null),
  totalRating: Union(String, Null),
  totalRatingVotes: Union(String, Null),
  ratings: Union(
    Array(Record({ rating: String, percent: String, votes: String })),
    Array(Record({})),
    Null
  ),
  errorMessage: String,
});

export const ImdbIdItems = Array(ImdbIdItem);
export type ImdbIdItem = Static<typeof ImdbIdItem>;

const Genre = Record({
  elapse: Optional(Number),
  results: Array(
    Record({
      nfid: Number,
      genre: String,
    })
  ),
  total: Optional(Number),
});

export const UnogsGenres = Genre;
export type Genre = Static<typeof Genre>;

const RemovedTitle = Record({
  elapse: Optional(Number),
  total: Optional(Number),
  results: Array(
    Record({
      title: String,
      deletedate: Optional(String),
      netflixid: Number,
      countrycode: Optional(String),
    })
  ),
});

export const RemovedTitles = RemovedTitle;
export type RemovedTitle = Static<typeof RemovedTitle>;

const TrailerItem = Record({
  imDbId: String,
  title: Union(String, Null),
  fullTitle: Union(String, Null),
  type: Union(String, Null),
  year: Union(String, Null),
  videoId: Union(String, Null),
  videoTitle: Union(String, Null),
  videoDescription: Union(String, Null),
  thumbnailUrl: Union(String, Null),
  uploadDate: Union(String, Null),
  link: Union(String, Null),
  linkEmbed: Union(String, Null),
  errorMessage: Union(String, Null),
});

export const TrailerItems = Array(TrailerItem);
export type TrailerItem = Static<typeof TrailerItem>;
