import React from 'react';
import styled from 'styled-components';
import { CatalogCard } from '@features/catalog';
import { useCatalog } from '@features/catalog/api/getCatalog';
import { color } from '@styles/theme';
import { useUserRating } from '@features/catalog/api/getUserRatings';
import { useViewportBottom } from '@features/catalog/hooks/useViewportBottom';

const List = styled.ul`
  background-color: ${color('dark', 300)};
  list-style: none;
`;

export function CatalogList() {
  const userRatings = useUserRating();
  const catalog = useCatalog();

  function getItemRating(nfid: bigint) {
    const ratedItem = userRatings?.data?.filter(
      (item) => item.catalog_item === nfid
    );
    if (ratedItem) return ratedItem[0];
  }

  useViewportBottom() && catalog.fetchNextPage();

  return catalog.status && userRatings.status === 'loading' ? (
    <p>Loading...</p>
  ) : (
    <List role="list">
      {catalog.data?.pages.map((group, i) => (
        <React.Fragment key={i}>
          {group.data?.map((item) => {
            const ratedItem = getItemRating(item.nfid);
            return (
              <li key={item.nfid}>
                <CatalogCard
                  title={item.title}
                  synopsis={item.synopsis}
                  img={item.img}
                  rating={item.rating}
                  stream={
                    ratedItem?.catalog_item === item.nfid
                      ? ratedItem?.stream
                      : null
                  }
                />
              </li>
            );
          })}
        </React.Fragment>
      ))}
    </List>
  );
}
