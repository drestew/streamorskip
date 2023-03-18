import React from 'react';
import styled from 'styled-components';
import { useCatalog, CatalogCard } from '@features/catalog';

const List = styled.ul`
  background-color: teal;
`;

export function CatalogList() {
  const { data } = useCatalog();

  return (
    <List>
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
