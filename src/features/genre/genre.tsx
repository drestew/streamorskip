import * as Select from '@radix-ui/react-select';
import arrow from '@public/arrow.png';
import Image from 'next/image';
import styled from 'styled-components';
import { useGenreList } from '@features/genre/getGenreList';
import { space } from '@styles/theme';

const GenreButton = styled(Select.Trigger)`
  background-color: whitesmoke;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 25px;
`;

const GenreList = styled(Select.Content)`
  background-color: white;
`;

const GenreScroll = styled(Select.Viewport)`
  padding: 5px;
`;

const GenreItem = styled(Select.Item)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${space(1)};
`;
export function Genre() {
  const { data } = useGenreList();

  return (
    <Select.Root defaultOpen={true}>
      <GenreButton aria-label="Genre">
        <Select.Value placeholder="All Genres" />
        <Select.Icon asChild={true}>
          <Image src={arrow} alt="Select genre icon" width={12} height={12} />
        </Select.Icon>
      </GenreButton>

      <Select.Portal>
        <GenreList>
          <GenreScroll>
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
  );
}
