import styled, { css } from 'styled-components';
import { color, space } from '@styles/theme';
import { ReactNode } from 'react';

type Color = 'primary' | 'secondary' | 'gray';
type Shade = 100 | 200 | 300 | 400 | 500;
type Size = 'sm' | 'md' | 'lg';
type ButtonProps = {
  color: Color;
  shade: Shade;
  size: Size;
  children: ReactNode;
};

const AppButton = styled.button<ButtonProps>`
  color: white;
  border-radius: 5px;
  border-style: unset;
  cursor: pointer;

  &:hover {
    background-color: ${color('primary', 400)};
  }

  &:disabled {
    background-color: ${color('gray', 100)};
  }

  ${(props) => {
    switch (props.color) {
      case 'primary':
        return css`
          background-color: ${color('primary', props.shade)};
        `;
      case 'secondary':
        return css`
          background-color: ${color('secondary', props.shade)};
        `;
      case 'gray':
        return css`
          background-color: ${color('gray', props.shade)};
        `;
    }
  }};

  ${(props) => {
    switch (props.size) {
      case 'sm':
        return css`
          padding: ${space(1)} ${space(2)};
        `;
      case 'md':
        return css`
          padding: ${space(2)} ${space(3)};
        `;
      case 'lg':
        return css`
          padding: ${space(3)} ${space(4)};
        `;
    }
  }}
`;

export function Button(props: ButtonProps) {
  return <AppButton {...props}>{props.children}</AppButton>;
}
