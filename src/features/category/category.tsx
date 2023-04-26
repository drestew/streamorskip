import * as ToggleGroup from '@radix-ui/react-toggle-group';
import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { color, space } from '@styles/theme';
import { ContentFilters, useFilters } from '../../hooks/useFilter';

const ContentToggle = styled(ToggleGroup.Item)<{ ['data-state']: boolean }>`
  color: white;
  padding: ${space(1)} ${space(2)};
  border-radius: ${space(2)};
  border: none;
  background-color: ${color('gray', 300)};
  box-shadow: inset 5px 5px 10px ${color('gray', 100)},
    inset -5px -5px 10px ${color('gray', 500)};

  ${(props) => {
    if (props.value === 'movie') {
      return css`
        border-bottom-right-radius: revert;
        border-top-right-radius: revert;
      `;
    }
    if (props.value === 'series') {
      return css`
        border-bottom-left-radius: revert;
        border-top-left-radius: revert;
      `;
    }
  }}
  ${(props) => {
    if (props['data-state'] === true) {
      return css`
        background-color: ${color('secondary', 300)};
        box-shadow: inset 5px 5px 10px ${color('secondary', 500)},
          inset -5px -5px 10px ${color('secondary', 300)};
        text-shadow: 0 0 10px ${color('gray', 500)};
      `;
    }
  }}
`;

export function Category({ category }: ContentFilters) {
  const [value, setValue] = useState(category);
  const { handleFilters } = useFilters();
  const selected = true;
  function handleValueChange(value: string) {
    handleFilters({ category: value });
  }

  function handleSelected(value: string) {
    setValue(value);
  }

  return (
    <ToggleGroup.Root
      type="single"
      onValueChange={() => handleValueChange(value)}
    >
      <ContentToggle
        value="movie"
        data-state={category === 'movie' ? selected : !selected}
        onClick={() => handleSelected('movie')}
      >
        Movie
      </ContentToggle>
      <ContentToggle
        value="series"
        data-state={category === 'series' ? selected : !selected}
        onClick={() => handleSelected('series')}
      >
        Series
      </ContentToggle>
    </ToggleGroup.Root>
  );
}
