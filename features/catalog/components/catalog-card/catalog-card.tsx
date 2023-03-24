import React from 'react';
import styled, { css } from 'styled-components';
import { Catalog } from '@features/catalog/types/catalog-card';
import Image from 'next/image';
import { color, font, space } from '@styles/theme';
import arrow from '@public/arrow.png';

type CardContent = Pick<Catalog, 'title' | 'synopsis' | 'rating' | 'img'>;

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
  grid-column-gap: ${space(3)};
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

const Poster = styled.div`
  grid-area: poster;
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

const convertRating = (rating: number) => rating * 10;
export function CatalogCard(props: CardContent) {
  const { title, synopsis, rating, img } = props;
  const ratingFrom100 = convertRating(rating);
  const [truncateSynopsis, setTruncateSynopsis] = React.useState(true);

  const toggleSynopsis = () => setTruncateSynopsis(!truncateSynopsis);

  return (
    <CardContainer>
      <Card>
        <Title>{title}</Title>
        <SynopsisContainer onClick={toggleSynopsis}>
          <Synopsis truncateSynopsis={truncateSynopsis}>{synopsis}</Synopsis>
          <Image src={arrow} alt="Open details icon" width={15} height={15} />
        </SynopsisContainer>
        <Poster>
          <Image src={img} alt="Content Poster" width="85" height="120" />
        </Poster>
        <StreamContainer>
          <span className="rating-text">Stream - {ratingFrom100}%</span>
          <StreamFill rating={ratingFrom100} />
        </StreamContainer>
        <SkipContainer>
          <span className="rating-text">Skip - {100 - ratingFrom100}% </span>
          <SkipFill rating={ratingFrom100} />
        </SkipContainer>
      </Card>
    </CardContainer>
  );
}
