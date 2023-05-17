import React from 'react';
import styled from 'styled-components';
import { CatalogCard } from '../../index';
import { color } from '@styles/theme';
import { InfiniteData } from '@tanstack/react-query';

const List = styled.ul`
  background-color: ${color('dark', 300)};
  list-style: none;
`;

type DBItem = {
  catalog: {
    nfid: number;
    title: string;
    img: string;
    synopsis: string;
    rating: number | null;
    vtype: string;
    on_Nflix: boolean;
  };
};

type CatalogListProps = {
  catalog:
    | InfiniteData<{
        data:
          | {
              catalog:
                | {
                    nfid: number;
                    title: string;
                    img: string;
                    synopsis: string;
                    rating: number | null;
                    vtype: string;
                    on_Nflix: boolean;
                  }
                | {
                    nfid: number;
                    title: string;
                    img: string;
                    synopsis: string;
                    rating: number | null;
                    vtype: string;
                    on_Nflix: boolean;
                  }[]
                | null;
            }[]
          | null;
        step: number;
      }>
    | undefined;
  userRatings: {
    data:
      | { user_id: string; catalog_item: number; stream: boolean }[]
      | null
      | undefined;
    status: 'error' | 'success' | 'loading';
  };
};

export function CatalogList({ catalog, userRatings }: CatalogListProps) {
  function getItemRating(nfid: number) {
    const ratedItem = userRatings?.data?.filter(
      (item) => item.catalog_item === nfid
    );
    if (ratedItem) return ratedItem[0];
  }

  return (
    <List role="list">
      {catalog?.pages.map((group, i) => (
        <React.Fragment key={i}>
          {group.data?.map((catalogItem: unknown, index) => {
            const item = catalogItem as DBItem;
            const ratedItem = getItemRating(item.catalog.nfid);
            return (
              <li key={item.catalog.nfid}>
                <CatalogCard
                  title={item.catalog.title}
                  synopsis={item.catalog.synopsis}
                  img={item.catalog.img}
                  rating={
                    item.catalog.rating === null ? 0 : item.catalog.rating
                  }
                  stream={
                    ratedItem?.catalog_item === item.catalog.nfid
                      ? ratedItem?.stream
                      : null
                  }
                  nfid={item.catalog.nfid}
                  priorityImg={index === 0}
                />
              </li>
            );
          })}
        </React.Fragment>
      ))}
    </List>
  );
}
