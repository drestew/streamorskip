import React from 'react';
import styled from 'styled-components';
import { Catalog } from '@features/catalog/types/catalog-card';

type CardContent = Pick<Catalog, 'title' | 'synopsis' | 'rating' | 'img'>;

const Card = styled.div`
  background-color: white;
  margin: 1rem;
`;

export function CatalogCard(props: CardContent) {
  const { title, synopsis, rating, img } = props;
  return (
    <Card>
      <p>{title}</p>
      <p>{synopsis}</p>
      <p>{rating}</p>
      <p>{img}</p>
    </Card>
  );
}
