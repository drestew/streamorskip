import React from 'react';
import styled, { css } from 'styled-components';
import Image from 'next/image';
import { color, font, space } from '@styles/theme';
import arrow from '@public/arrow.png';
import thumb_outline from '@public/thumb_outline.svg';
import thumb_solid from '@public/thumb_solid.svg';
import { deleteUserRating, updateUserRating } from '@features/catalog';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

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
  stream: boolean | null;
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

type CardProps = CardContent & UserRating & ImgPriority & Modal;

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

  ${(props) => {
    if (!props.truncateSynopsis) {
      return css`
        & > * {
          //padding-bottom: 100%;
        }
      `;
    }
  }};
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
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const {
    title,
    synopsis,
    rating,
    img,
    stream,
    nfid,
    priorityImg,
    modalState,
  } = props;
  const [streamRating, setStreamRating] = React.useState(stream);
  const ratingFrom100 = convertRating(rating);
  const [truncateSynopsis, setTruncateSynopsis] = React.useState(true);

  function toggleSynopsis() {
    setTruncateSynopsis(!truncateSynopsis);
  }

  function handleClick(thumbIcon: string) {
    if (user) {
      if (thumbIcon === 'skip' && streamRating !== false) {
        setStreamRating(false);
        updateUserRating(nfid, false, user, supabaseClient);
      } else if (thumbIcon === 'skip' && streamRating === false) {
        setStreamRating(null);
        deleteUserRating(nfid, user, supabaseClient);
      } else if (thumbIcon === 'stream' && !streamRating) {
        setStreamRating(true);
        updateUserRating(nfid, true, user, supabaseClient);
      } else if (thumbIcon === 'stream' && streamRating) {
        setStreamRating(null);
        deleteUserRating(nfid, user, supabaseClient);
      }
    } else {
      modalState();
    }
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const key = event.target as HTMLElement;
      if (key.dataset.rating === 'stream') {
        handleClick('stream');
      } else if (key.dataset.rating === 'skip') {
        handleClick('skip');
      } else if (key.dataset.synopsis === 'synopsis') {
        toggleSynopsis();
      }
    }
  }

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
            //fill
            //style={{ objectFit: 'contain' }}
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
            src={streamRating === false ? thumb_solid : thumb_outline}
            alt="Thumb down icon"
            data-rating="skip"
            width="50"
            height="50"
            style={{ transform: 'rotate(180deg)' }}
            onClick={() => handleClick('skip')}
            tabIndex={0}
            onKeyDown={handleKeyDown}
          />
          <Image
            src={streamRating ? thumb_solid : thumb_outline}
            alt="Thumb up icon"
            data-rating="stream"
            width="50"
            height="50"
            onClick={() => handleClick('stream')}
            tabIndex={0}
            onKeyDown={handleKeyDown}
          />
        </IconContainer>
        <SaveListContainer>
          <SaveList onClick={() => modalState()}>Add to My List</SaveList>
        </SaveListContainer>
      </Card>
    </CardContainer>
  );
}
