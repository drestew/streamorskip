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
