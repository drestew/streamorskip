import React from 'react';
import styled, { css } from 'styled-components';

type CardProps = {
  border: boolean;
};

const Card = styled.button<{ border: string }>`
  background-color: teal;
  width: 80%;

  ${(props) => {
    if (props.border === 'red') {
      return css`
        color: red;
      `;
    }
    if (props.border === 'blue') {
      return css`
        color: blue;
      `;
    }
  }}
`;

export function CatalogCard(border: string, children: React.ReactNode) {
  return <Card border={border}>{children}</Card>;
}
