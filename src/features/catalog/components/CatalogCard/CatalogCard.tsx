import React from 'react';
import styled, { css } from 'styled-components';
import Image from 'next/image';
import { color, font, space } from '@styles/theme';
import arrow from '@public/arrow.png';
import thumb_outline from '@public/thumb_outline.svg';
import thumb_solid from '@public/thumb_solid.svg';
import { updateUserRating } from '@features/catalog';
import { SupabaseClient } from '@supabase/auth-helpers-react';
import { Database } from '@src/types/supabase';
import { updateSavedList } from '@features/catalog/api/updateSavedList';
import { QueryClient, useMutation } from '@tanstack/react-query';

type Catalog = {
  nfid: number;
  title: string;
  synopsis: string;
  img: string;
  on_Nflix: boolean;
  rating: number;
  vtype: 'movie' | 'series';
};

export type UserRating = {
  userId: string | null;
  userRatings:
    | { user_id: string; catalog_item: number; stream: boolean }[]
    | null;
  setUserRatings: React.Dispatch<
    React.SetStateAction<
      { user_id: string; catalog_item: number; stream: boolean }[] | null
    >
  >;
};

type ImgPriority = {
  priorityImg: boolean;
};

type CardContent = Pick<
  Catalog,
  'title' | 'synopsis' | 'rating' | 'img' | 'nfid'
>;

type Modal = {
  modalState: () => void;
};

type SavedItem = {
  supabase: SupabaseClient<Database>;
  savedList: { catalog_item: number }[] | null;
  setSavedList: React.Dispatch<
    React.SetStateAction<{ catalog_item: number }[] | null>
  >;
};

type Query = {
  queryClient: QueryClient;
};

type CardProps = CardContent &
  UserRating &
  ImgPriority &
  Modal &
  SavedItem &
  Query;

const CardContainer = styled.div`
  margin: ${space(4)} auto;
`;

const Card = styled.div`
  display: grid;
  width: 100%;
  background-color: white;
  padding: ${space(3)};
  grid-template-areas:
    'poster title title'
    'poster synopsis synopsis '
    'poster stream stream'
    'poster skip skip'
    'icon icon icon'
    'save-list save-list save-list';
  border-radius: ${space(2)};

  .rating-text {
    ${font('xs', 'regular')};
  }
`;

const Title = styled.h4`
  grid-area: title;
  text-decoration: underline;
  margin: ${space(0)};
`;

const Poster = styled.div<{ truncateSynopsis: boolean }>`
  grid-area: poster;
  width: ${space(20)};
  position: relative;
  margin-right: ${space(3)};
`;

const SynopsisContainer = styled.div`
  grid-area: synopsis;
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  margin-bottom: ${space(2)};
`;

const Synopsis = styled.p<{ truncateSynopsis: boolean }>`
  ${font('sm', 'regular')};
  width: 90%;

  ${(props) => {
    if (props.truncateSynopsis) {
      return css`
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        & + * {
          transition: transform 0.5s ease;
        }
      `;
    } else {
      return css`
        & + * {
          transition: transform 0.5s ease;
          transform: rotate(-90deg);
        }
      `;
    }
  }}
`;

const StreamContainer = styled.div`
  grid-area: stream;
`;

const StreamFill = styled.div<{ rating: number }>`
  height: ${space(2)};
  background-color: ${color('primary', 300)};
  width: ${(props) => props.rating}%;
  border-radius: ${space(2)};
`;

const SkipContainer = styled.div`
  grid-area: skip;
`;

const SkipFill = styled.div<{ rating: number }>`
  height: ${space(2)};
  background-color: ${color('primary', 300)};
  width: ${(props) => 100 - props.rating}%;
  border-radius: ${space(2)};
`;

const IconContainer = styled.div`
  grid-area: 5 / 1 / 6 / 5;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 ${space(5)};
  margin-top: ${space(4)};
  cursor: pointer;
`;

const SaveListContainer = styled.div`
  margin-top: ${space(1)};
  grid-area: save-list;
  ${font('xs', 'regular')}
  display: flex;
  justify-content: center;
`;

const SaveList = styled.button`
  border-style: none;
  background-color: white;
  cursor: pointer;
`;

const convertRating = (rating: number) => rating * 10;
export function CatalogCard(props: CardProps) {
  const {
    title,
    synopsis,
    rating,
    img,
    nfid,
    priorityImg,
    modalState,
    queryClient,
    supabase,
    userId,
    userRatings,
    setUserRatings,
    savedList,
    setSavedList,
  } = props;
  const [userRating, setUserRating] = React.useState<boolean | null>(null);
  const ratingFrom100 = convertRating(rating);
  const [truncateSynopsis, setTruncateSynopsis] = React.useState(true);
  const [savedToList, setSavedToList] = React.useState<boolean | null>(null);

  function toggleSynopsis() {
    setTruncateSynopsis(!truncateSynopsis);
  }

  React.useEffect(() => {
    setSavedToList(
      savedList?.some((item) => item.catalog_item === nfid) || false
    );
  }, [savedList]);

  React.useEffect(() => {
    const catalogItem = userRatings?.find((item) => item.catalog_item === nfid);
    setUserRating(catalogItem ? catalogItem.stream : null);
  }, [userRatings]);

  function handleRating(thumbIcon: string) {
    if (thumbIcon === 'skip' && userRating !== false) {
      setUserRating(false);
    } else if (thumbIcon === 'skip' && userRating === false) {
      setUserRating(null);
    } else if (thumbIcon === 'stream' && !userRating) {
      setUserRating(true);
    } else if (thumbIcon === 'stream' && userRating) {
      setUserRating(null);
    }

    mutationUpdateUserRating.mutate();
  }

  async function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const key = event.target as HTMLElement;
      if (key.dataset.rating === 'stream') {
        await handleRating('stream');
      } else if (key.dataset.rating === 'skip') {
        await handleRating('skip');
      } else if (key.dataset.synopsis === 'synopsis') {
        toggleSynopsis();
      }
    }
  }

  function handleSave() {
    mutationUpdateSavedList.mutate();
  }

  const mutationUpdateSavedList = useMutation({
    mutationFn: () => updateSavedList(supabase, userId, nfid, savedToList),
    onSuccess: async () => {
      await queryClient.refetchQueries(['my-list', userId]);
      const { data } = await supabase
        .from('saved_list')
        .select('catalog_item')
        .eq('user_id', userId);
      setSavedList(data);
    },
  });

  const mutationUpdateUserRating = useMutation({
    mutationFn: () => updateUserRating(nfid, userRating, userId, supabase),
    onSuccess: async () => {
      await queryClient.refetchQueries(['my-ratings', userId, 'stream']);
      await queryClient.refetchQueries(['my-ratings', userId, 'skip']);
      const { data } = await supabase
        .from('rating')
        .select('user_id, catalog_item, stream')
        .eq('user_id', userId);
      setUserRatings(data);
    },
  });

  return (
    <CardContainer tabIndex={0}>
      <Card>
        <Title>{title}</Title>
        <SynopsisContainer
          onClick={toggleSynopsis}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          data-synopsis="synopsis"
        >
          <Synopsis truncateSynopsis={truncateSynopsis}>{synopsis}</Synopsis>
          <Image src={arrow} alt="Open details icon" width={15} height={15} />
        </SynopsisContainer>
        <Poster truncateSynopsis={truncateSynopsis}>
          <Image
            src={img}
            alt="Content Poster"
            width="80"
            height="110"
            sizes="(max-width: 1200px) 120px, (max-width: 768) 80px"
            priority={priorityImg}
          />
        </Poster>
        <StreamContainer>
          <span className="rating-text">Stream - {ratingFrom100}%</span>
          <StreamFill rating={ratingFrom100} />
        </StreamContainer>
        <SkipContainer>
          <span className="rating-text">Skip - {100 - ratingFrom100}% </span>
          <SkipFill rating={ratingFrom100} />
        </SkipContainer>
        <IconContainer>
          <Image
            src={userRating === false ? thumb_solid : thumb_outline}
            alt="Thumb down icon"
            data-rating="skip"
            width="50"
            height="50"
            style={{ transform: 'rotate(180deg)' }}
            onClick={() => handleRating('skip')}
            tabIndex={0}
            onKeyDown={handleKeyDown}
          />
          <Image
            src={userRating ? thumb_solid : thumb_outline}
            alt="Thumb up icon"
            data-rating="stream"
            width="50"
            height="50"
            onClick={() => handleRating('stream')}
            tabIndex={0}
            onKeyDown={handleKeyDown}
          />
        </IconContainer>
        <SaveListContainer>
          <SaveList onClick={userId ? handleSave : modalState}>
            {savedToList ? 'Remove from My List' : 'Add to My List'}
          </SaveList>
        </SaveListContainer>
      </Card>
    </CardContainer>
  );
}
