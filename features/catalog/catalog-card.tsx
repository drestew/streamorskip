import React from 'react';
import styled, { css } from 'styled-components';

type CardProps = {
  border: string;
  children: React.ReactNode;
};

const Card = styled.button<CardProps>`
  background-color: teal;
  width: 80%;

  ${(props) => {
    if (props.border === 'red') {
      return css`
        color: red;
        border: solid red 2px;
        background-color: #fffe00;
      `;
    }
    if (props.border === 'blue') {
      return css`
        color: blue;
        border: solid blue 2px;
        background-color: coral;
      `;
    }
  }}
`;

export function CatalogCard({ border, children }: CardProps) {
  return <Card border={border}>{children}</Card>;
}
