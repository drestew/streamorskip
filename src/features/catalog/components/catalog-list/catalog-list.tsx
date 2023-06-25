import React from 'react';
import styled from 'styled-components';
import { CatalogCard } from '../../index';
import { color } from '@styles/theme';
import { InfiniteData } from '@tanstack/react-query';
import LoadingSkeleton from '@features/catalog/components/loading-skeleton/loading-skeleton';

const List = styled.ul`
  background-color: ${color('dark', 300)};
  list-style: none;
  padding: 0;
`;

type CatalogListProps = {
  catalog:
    | InfiniteData<{
        filteredData:
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
        step: number;
      }>
    | undefined;
  userRatings: {
    data:
      | { user_id: string; catalog_item: number; stream: boolean }[]
      | null
      | undefined;
  };
  isFetching: boolean;
};

export function CatalogList({
  catalog,
  userRatings,
  isFetching,
}: CatalogListProps) {
  function getItemRating(nfid: number) {
    const ratedItem = userRatings?.data?.filter(
      (item) => item.catalog_item === nfid
    );
    if (ratedItem) return ratedItem[0];
  }

  const loadingSkeletonArr: React.ReactNode[] = new Array(10)
    .fill('')
    .map((item, index) => {
      return (
        <li key={index}>
          <LoadingSkeleton />
        </li>
      );
    });

  return (
    <List role="list">
      {isFetching && <List>{loadingSkeletonArr}</List>}
      {catalog?.pages.map((group, i) => (
        <React.Fragment key={i}>
          {group.filteredData?.map((item, index) => {
            const ratedItem = getItemRating(item.nfid);
            return (
              <li key={item.nfid}>
                <CatalogCard
                  title={item.title}
                  synopsis={item.synopsis}
                  img={item.img}
                  rating={item.rating === null ? 0 : item.rating}
                  stream={
                    ratedItem?.catalog_item === item.nfid
                      ? ratedItem?.stream
                      : null
                  }
                  nfid={item.nfid}
                  priorityImg={index === 0}
                />
              </li>
            );
          })}
          {isFetching && <List>{loadingSkeletonArr}</List>}
        </React.Fragment>
      ))}
    </List>
  );
}
