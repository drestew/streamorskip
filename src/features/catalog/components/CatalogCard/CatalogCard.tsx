import React from 'react';
import styled, { css, keyframes } from 'styled-components';
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
import { useRouter } from 'next/router';
import { Modal } from '@components/Modal/Modal';
import { Trailer } from '@features/catalog/components/Trailer/Trailer';

type Catalog = {
  nfid: number;
  title: string;
  synopsis: string;
  img: string;
  on_Nflix?: boolean;
  vtype?: 'movie' | 'series';
  streamCount: number;
  skipCount: number;
  trailer: string | null;
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
  votedNfids: { catalog_item: number; stream: boolean }[] | null;
};

type ImgPriority = {
  priorityImg: boolean;
};

type Modal = {
  signupModalOpen?: () => void;
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

type Window = {
  windowWidth: number;
};

type CardProps = Catalog &
  UserRating &
  ImgPriority &
  Modal &
  SavedItem &
  Query &
  Window;

const FadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const CardContainer = styled.div<{
  router: boolean;
  savedToList: boolean | null;
}>`
  margin: ${space(4)} auto;
  opacity: 1;

  ${(props) => {
    if (props.router && props.savedToList === false) {
      return css`
        animation: ${FadeOut} 300ms ease-in-out forwards;
      `;
    }
  }}
`;

const Card = styled.div`
  display: grid;
  position: relative;
  width: 100%;
  background-color: white;
  padding: ${space(3)};
  grid-template-areas:
    'poster title title'
    'poster synopsis synopsis '
    'poster rating rating'
    'poster rating rating'
    'icon icon icon'
    'save-list save-list save-list';
  border-radius: ${space(2)};
  // to no resize the columns when synopsis not truncated
  grid-template-columns: 1fr 1.5fr 1.5fr;

  .rating-text {
    ${font('xs', 'regular')};
  }

  @media (min-width: 550px) {
    grid-template-columns: auto;
  }

  @media (min-width: 800px) {
    grid-template-areas:
      'poster poster title title title'
      'poster poster synopsis synopsis synopsis '
      'poster poster rating rating rating'
      'poster poster rating rating rating'
      'poster poster icon icon icon'
      'poster poster save-list save-list save-list';
`;

const Title = styled.p`
  ${font('md', 'bold')};
  grid-area: title;
  text-decoration: underline;
  margin: ${space(0)};
`;

const Poster = styled.div<{ truncateSynopsis: boolean }>`
  grid-area: poster;
  width: ${space(20)};
  position: relative;
  margin-right: ${space(3)};

  @media (min-width: 800px) {
    margin-right: ${space(4)};
    width: 100%;
    grid-area: 1 / 1 / 6 / 3;
  }
`;

const TrailerContainer = styled.div<{
  trailer: string | null;
  truncateSynopsis: boolean;
}>`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  align-items: flex-end;

  @media (min-width: 800px) {
    position: static;
    width: auto;
    height: auto;
    align-items: center;
    grid-area: 6 / 1 / 7 / 3;
    margin-right: ${space(4)};

    ${(props) => {
      if (!props.truncateSynopsis) {
        return css`
          grid-area: auto;
          position: absolute;
          // positioned to not move when row stretched from synopsis
          top: calc(180px + ${space(3)});
          left: ${space(3)};
          width: 120px;
        `;
      }
    }}
  }

  ${(props) => {
    if (props.trailer) {
      return css`
        cursor: pointer;
      `;
    }
  }}
`;

const TrailerText = styled.p`
  background-color: ${color('primary', 300)};
  color: white;
  ${font('xs', 'regular')};
  width: 100%;

  @media (min-width: 800px) {
    height: 100%;
    padding: ${space(1)};
  }
`;

const SynopsisContainer = styled.div<{ truncateSynopsis: boolean }>`
  grid-area: synopsis;
  overflow: hidden;
  display: flex;
  cursor: pointer;
  margin-bottom: ${space(2)};

  ${(props) => {
    if (!props.truncateSynopsis) {
      return css`
        grid-row: 2 / 5;
        grid-column: 1 / 5;
        padding: ${space(1)};
        gap: ${space(1)};
        z-index: 1;
        border-radius: 5px;
        border: solid 1px #eeeefa;
        background: #f7f7fd;

        @media (min-width: 800px) {
          grid-area: synopsis;
          border: none;
          background: white;
          padding: 0;
        }
      `;
    }
  }}
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

const RatingContainer = styled.div`
  grid-area: rating;
  display: grid;
  grid-template-columns: 0.8fr 0.3fr 2fr;
  grid-template-rows: 1fr 1fr 0.5fr;
  grid-row-gap: ${space(1)};
  grid-column-gap: ${space(2)};
  align-items: center;

  @media (min-width: 350px) {
    grid-template-columns: 1fr 0.4fr 2fr;
  }

  @media (min-width: 550px) {
    grid-template-columns: 1fr 0.8fr 3fr;
  }

  @media (min-width: 800px) {
    grid-template-columns: 1fr 0.8fr 5fr;
  }

  @media (min-width: 1100px) {
    grid-column-gap: ${space(1)};
    grid-template-columns: 1.2fr 0.8fr 8fr;
  }
`;

const StreamText = styled.span`
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  ${font('xs', 'bold')};
`;

const StreamPercent = styled.span`
  grid-column: 2 / 3;
  grid-row: 1 / 2;
  ${font('xs', 'bold')};
`;

const StreamBar = styled.div<{ width: number }>`
  grid-column: 3 / 4;
  grid-row: 1 / 2;
  height: ${space(2)};
  background-color: ${color('primary', 300)};
  width: ${(props) => props.width}%;

  border-radius: ${space(2)};
`;

const SkipText = styled.span`
  grid-column: 1 / 2;
  grid-row: 2 / 3;
  ${font('xs', 'bold')};
`;

const SkipPercent = styled.span`
  grid-column: 2 / 3;
  grid-row: 2 / 3;
  ${font('xs', 'bold')};
`;

const SkipBar = styled.div<{ width: number }>`
  grid-column: 3 / 4;
  grid-row: 2 / 3;
  height: ${space(2)};
  background-color: ${color('primary', 300)};
  width: ${(props) => props.width}%;
  border-radius: ${space(2)};
`;

const VoteTotal = styled.span`
  ${font('xs', 'regular')};
  color: ${color('gray', 200)};
  font-style: italic;
  grid-column: 1 / 3;
  grid-row: 3 / 4;
`;

const IconContainer = styled.div`
  grid-area: 5 / 1 / 6 / 5;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 ${space(5)};
  margin-top: ${space(4)};

  @media (min-width: 800px) {
    grid-area: 5 / 3 / 6 / 6;
  }
`;

const StreamSkipIcon = styled.div`
  cursor: pointer;
`;

const SaveListContainer = styled.div<{ truncateSynopsis: boolean }>`
  margin-top: ${space(1)};
  grid-area: save-list;
  ${font('xs', 'regular')}
  display: flex;
  justify-content: center;

  @media (min-width: 550px) {
    ${(props) => {
      if (!props.truncateSynopsis) {
        return css`
          grid-area: 6 / 1 / 7 / 5;
        `;
      }
    }}
  }

  @media (min-width: 800px) {
    ${(props) => {
      if (!props.truncateSynopsis) {
        return css`
          grid-area: 6 / 3 / 7 / 6;
        `;
      }
    }}
  }
`;

const SaveList = styled.button`
  border-style: none;
  background-color: white;
  cursor: pointer;
  color: ${color('gray', 500)};
`;

export function CatalogCard(props: CardProps) {
  const {
    title,
    synopsis,
    img,
    nfid,
    streamCount,
    skipCount,
    priorityImg,
    signupModalOpen,
    queryClient,
    supabase,
    userId,
    userRatings,
    votedNfids,
    setUserRatings,
    savedList,
    setSavedList,
    trailer,
    windowWidth,
  } = props;
  const [userRating, setUserRating] = React.useState<boolean | null>(null);
  const [truncateSynopsis, setTruncateSynopsis] = React.useState(true);
  const [savedToList, setSavedToList] = React.useState<boolean | null>(null);
  const [trailerModalOpen, setTrailerModalOpen] =
    React.useState<boolean>(false);
  const [dynamicVoteCount, setDynamicVoteCount] = React.useState<{
    stream: number;
    skip: number;
  }>({ stream: 0, skip: 0 });
  const [totalVotes, setTotalVotes] = React.useState<number>(
    streamCount + skipCount
  );
  const router = useRouter();
  const staticVoteCount = streamCount + skipCount;

  function toggleSynopsis() {
    setTruncateSynopsis(!truncateSynopsis);
  }

  React.useEffect(() => {
    setSavedToList(
      savedList && savedList.some((item) => item.catalog_item === nfid)
    );
  }, [savedList]);

  React.useEffect(() => {
    const catalogItem = userRatings?.find((item) => item.catalog_item === nfid);
    setUserRating(catalogItem ? catalogItem.stream : null);
  }, [userRatings]);

  React.useEffect(() => {
    if (!votedNfids) {
      setDynamicVoteCount({ stream: 0, skip: 0 });
      return;
    }

    const cardItem = votedNfids.filter((item) => item.catalog_item === nfid);
    const streamCount = cardItem.filter((item) => item.stream).length;
    const skipCount = cardItem.filter((item) => !item.stream).length;
    setDynamicVoteCount({ stream: streamCount, skip: skipCount });
    setTotalVotes(staticVoteCount + streamCount + skipCount);
  }, [nfid, votedNfids]);

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
      // timeout to delay fade out of card (0 is fine because event loop)
      setTimeout(
        async () => await queryClient.refetchQueries(['my-list', userId]),
        0
      );
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

  function voteCountTotal() {
    const totalVotes =
      staticVoteCount + dynamicVoteCount.stream + dynamicVoteCount.skip;
    const streamPercent =
      ((streamCount + dynamicVoteCount.stream) / totalVotes) * 100;
    const skipPercent =
      ((skipCount + dynamicVoteCount.skip) / totalVotes) * 100;

    return { totalVotes, streamPercent, skipPercent };
  }

  function openTrailerModal() {
    if (trailerModalOpen) {
      return setTrailerModalOpen(false);
    }

    setTrailerModalOpen(true);
  }

  return (
    <CardContainer
      tabIndex={0}
      router={router.pathname.includes('my-list')}
      savedToList={savedToList}
    >
      <Modal modalOpen={trailerModalOpen} openChange={openTrailerModal}>
        <Trailer trailer={trailer} title={title} />
      </Modal>
      <Card>
        <Title>{title}</Title>
        <SynopsisContainer
          onClick={toggleSynopsis}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          data-synopsis="synopsis"
          truncateSynopsis={truncateSynopsis}
        >
          <Synopsis truncateSynopsis={truncateSynopsis}>{synopsis}</Synopsis>
          <Image src={arrow} alt="Open details icon" width={15} height={15} />
        </SynopsisContainer>
        {windowWidth < 800 ? (
          <Poster truncateSynopsis={truncateSynopsis}>
            <Image
              src={img}
              alt={title}
              width={80}
              height={120}
              priority={priorityImg}
            />
            {trailer && (
              <TrailerContainer
                trailer={trailer}
                truncateSynopsis={truncateSynopsis}
                onClick={openTrailerModal}
              >
                <TrailerText>Play Trailer</TrailerText>
              </TrailerContainer>
            )}
          </Poster>
        ) : (
          <>
            <Poster truncateSynopsis={truncateSynopsis}>
              <Image
                src={img}
                alt={title}
                width={120}
                height={180}
                priority={priorityImg}
              />
            </Poster>
            {trailer && (
              <TrailerContainer
                trailer={trailer}
                truncateSynopsis={truncateSynopsis}
                onClick={openTrailerModal}
              >
                <TrailerText>Play Trailer</TrailerText>
              </TrailerContainer>
            )}
          </>
        )}
        <RatingContainer>
          <StreamText>Stream it</StreamText>
          <StreamPercent>
            {Math.round(voteCountTotal().streamPercent) || 0}%
          </StreamPercent>
          <StreamBar width={Math.round(voteCountTotal().streamPercent || 0)} />
          <SkipText>Skip it</SkipText>
          <SkipPercent>
            {Math.round(voteCountTotal().skipPercent) || 0}%
          </SkipPercent>
          <SkipBar width={Math.round(voteCountTotal().skipPercent) || 0} />
          <VoteTotal>Votes: {totalVotes || 0}</VoteTotal>
        </RatingContainer>
        <IconContainer>
          <StreamSkipIcon>
            <Image
              src={userRating === false ? thumb_solid : thumb_outline}
              alt="Thumb down icon"
              data-rating="skip"
              width="50"
              height="50"
              style={{ transform: 'rotate(180deg)' }}
              onClick={userId ? () => handleRating('skip') : signupModalOpen}
              tabIndex={0}
              onKeyDown={handleKeyDown}
            />
          </StreamSkipIcon>
          <StreamSkipIcon>
            <Image
              src={userRating ? thumb_solid : thumb_outline}
              alt="Thumb up icon"
              data-rating="stream"
              width="50"
              height="50"
              onClick={userId ? () => handleRating('stream') : signupModalOpen}
              tabIndex={0}
              onKeyDown={handleKeyDown}
            />
          </StreamSkipIcon>
        </IconContainer>
        <SaveListContainer truncateSynopsis={truncateSynopsis}>
          <SaveList onClick={userId ? handleSave : signupModalOpen}>
            {userId
              ? savedToList
                ? 'Remove from My List'
                : 'Add to My List'
              : 'Add to My List'}
          </SaveList>
        </SaveListContainer>
      </Card>
    </CardContainer>
  );
}
