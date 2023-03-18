import React from 'react';
import styled, { css } from 'styled-components';
import { useCatalog } from '@features/catalog/api/getCatalog';

const List = styled.ul`
  background-color: teal;
  width: 80%;
`;

export function CatalogList() {
  const { data } = useCatalog();

  return (
    <List>
      {data?.map((item) => {
        return (
          <li key={item.nfid}>
            <p>{item.title}</p>
            <p>{item.img}</p>
            <p>{item.rating}</p>
            <p>{item.synopsis}</p>
          </li>
        );
      })}
    </List>
  );
}
