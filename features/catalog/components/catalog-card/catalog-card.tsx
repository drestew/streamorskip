import { useState } from 'react';
import styled, { css } from 'styled-components';
import Image from 'next/image';
import { color, font, space } from '@styles/theme';
import arrow from '@public/arrow.png';
import thumb_outline from '@public/thumb_outline.svg';
import thumb_solid from '@public/thumb_solid.svg';

type Catalog = {
  nfid: bigint;
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
type CardContent = Pick<Catalog, 'title' | 'synopsis' | 'rating' | 'img'>;
type CardProps = CardContent & UserRating;

const CardContainer = styled.div`
  max-width: 400px;
  margin: ${space(4)} auto;
  padding-left: ${space(4)};
  padding-right: ${space(4)};
`;

const Card = styled.div`
  display: grid;
  background-color: white;
  padding: ${space(3)};
  grid-template-areas:
    'poster title title'
    'poster synopsis synopsis '
    'poster stream stream'
    'poster skip skip';
    'icon icon icon';
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
  display: grid;
  width: ${space(20)};
  position: relative;
  margin-right: ${space(3)};

  ${(props) => {
    if (!props.truncateSynopsis) {
      return css`
        & > * {
          padding-bottom: 100%;
        }
      `;
    }
  }}
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
`;
const convertRating = (rating: number) => rating * 10;
export function CatalogCard(props: CardProps) {
  const { title, synopsis, rating, img, stream } = props;
  const [streamRating, setStreamRating] = useState(stream);
  const ratingFrom100 = convertRating(rating);
  const [truncateSynopsis, setTruncateSynopsis] = useState(true);
  const toggleSynopsis = () => setTruncateSynopsis(!truncateSynopsis);

  return (
    <CardContainer tabIndex={0}>
      <Card>
        <Title>{title}</Title>
        <SynopsisContainer onClick={toggleSynopsis}>
          <Synopsis truncateSynopsis={truncateSynopsis}>{synopsis}</Synopsis>
          <Image src={arrow} alt="Open details icon" width={15} height={15} />
        </SynopsisContainer>
        <Poster truncateSynopsis={truncateSynopsis}>
          <Image
            src={img}
            alt="Content Poster"
            fill
            style={{ objectFit: 'contain' }}
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
            width="50"
            height="50"
            style={{ transform: 'rotate(180deg)' }}
            onClick={() =>
              streamRating === false
                ? setStreamRating(null)
                : setStreamRating(false)
            }
          />
          <Image
            src={streamRating ? thumb_solid : thumb_outline}
            alt="Thumb up icon"
            width="50"
            height="50"
            onClick={() =>
              streamRating ? setStreamRating(null) : setStreamRating(true)
            }
          />
        </IconContainer>
      </Card>
    </CardContainer>
  );
}
