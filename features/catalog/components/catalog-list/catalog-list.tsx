import React from 'react';
import styled from 'styled-components';
import { useCatalog, CatalogCard } from '@features/catalog';

const List = styled.ul`
  background-color: teal;
  list-style: none;
`;

export function CatalogList() {
  const { data } = useCatalog();

  return (
    <List role="list">
      {data?.map((item) => {
        return (
          <li key={item.nfid}>
            <CatalogCard
              title={item.title}
              synopsis={item.synopsis}
              img={item.img}
              rating={item.rating}
            />
          </li>
        );
      })}
    </List>
  );
}
