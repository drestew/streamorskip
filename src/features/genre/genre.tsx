import * as Select from '@radix-ui/react-select';
import styled from 'styled-components';
import { useGenreList } from '@features/genre/getGenreList';
import { color, space } from '@styles/theme';
import React from 'react';
import { ContentFilters, useFilters } from '../../hooks/useFilter';

const GenreContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const GenreButton = styled(Select.Trigger)`
  background-color: ${color('dark', 300)};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 25px;
  gap: ${space(2)};
  border: none;
  border-bottom: white 1px solid;
`;

const GenreList = styled(Select.Content)`
  background-color: white;
  border-radius: ${space(1)};
`;

const GenreScroll = styled(Select.Viewport)`
  padding: 5px;
`;

const StyledItem = styled(Select.Item)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${space(1)};
  cursor: pointer;

  &:hover {
    background-color: ${color('primary', 300)};
    color: white;
  }
`;

type GenreItemProps = {
  children: React.ReactNode;
  value: string;
};

const GenreItem = React.forwardRef(
  (
    { children, ...props }: GenreItemProps,
    forwardedRef: React.Ref<HTMLDivElement>
  ) => {
    return (
      <StyledItem {...props} ref={forwardedRef}>
        <Select.ItemText>{children}</Select.ItemText>
      </StyledItem>
    );
  }
);
export function Genre({ genre }: ContentFilters) {
  const { data } = useGenreList();
  const { handleFilters } = useFilters();
  const genreTextOnly = genre?.replace(/%/g, '');
  GenreItem.displayName = 'GenreItem';

  function handleValueChange(value: typeof genre) {
    handleFilters({ genre: value });
  }

  return (
    <GenreContainer>
      <Select.Root value={genre} onValueChange={handleValueChange}>
        <GenreButton aria-label="Genre">
          <Select.Value>
            {genre === '%%' ? 'All Genres' : genreTextOnly}
          </Select.Value>
        </GenreButton>

        <Select.Portal>
          <GenreList>
            <GenreScroll>
              <GenreItem key={'000'} value={'All Genres'}>
                All Genres
              </GenreItem>
              {data?.map((genre) => {
                return (
                  <GenreItem key={genre.id} value={genre.genre}>
                    {genre.genre}
                  </GenreItem>
                );
              })}
            </GenreScroll>
          </GenreList>
        </Select.Portal>
      </Select.Root>
    </GenreContainer>
  );
}
