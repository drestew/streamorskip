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

const ImdbRatingItem = Record({
  id: String,
  title: String,
  rating: Optional(Number),
});

export const ImdbRatingItems = Array(ImdbRatingItem);
export type ImdbRatingItem = Static<typeof ImdbRatingItem>;

const ImdbIdItem = Record({
  imdbid: Union(String, Null),
  title: String,
  nfid: Number,
});

export const ImdbIdItems = Array(ImdbIdItem);
export type ImdbIdItem = Static<typeof ImdbIdItem>;

const TrailerItem = Record({
  resource: Record({
    id: String,
    videos: Optional(
      Array(
        Record({
          id: String,
        })
      )
    ),
  }),
});

export const TrailerItems = TrailerItem;
export type TrailerItem = Static<typeof TrailerItem>;

const TrailerUrl = Record({
  resource: Optional(
    Record({
      encodings: Array(
        Record({
          mimeType: String,
          playUrl: String,
        })
      ),
    })
  ),
});

export const TrailerUrls = TrailerUrl;
export type TrailerUrl = Static<typeof TrailerUrl>;

const Genre = Record({
  nfid: Number,
  genres: Optional(
    Array(
      Record({
        nfid: Number,
        genre: String,
      })
    )
  ),
});

export const Genres = Array(Genre);
export type Genre = Static<typeof Genre>;

const DeletedItem = Record({
  title: String,
  deletedate: String,
  netflixid: Number,
  countrycode: String,
});

export const DeletedItems = Array(DeletedItem);
export type DeletedItem = Static<typeof DeletedItem>;