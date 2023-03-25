export type Catalog = {
  nfid: bigint;
  title: string;
  synopsis: string;
  img: string;
  on_Nflix: boolean;
  rating: number;
  vtype: 'movie' | 'series';
};
