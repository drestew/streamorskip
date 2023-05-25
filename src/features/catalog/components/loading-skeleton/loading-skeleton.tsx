import styled from 'styled-components';
import { color, space } from '@styles/theme';

const CardContainer = styled.div`
  margin: ${space(4)} auto;
  padding-left: ${space(4)};
  padding-right: ${space(4)};

  * {
    border-radius: 3px;
  }
`;

const Card = styled.div`
  display: grid;
  background-color: white;
  padding: ${space(3)};
  width: 100%;
  grid-template-areas:
    'poster title title'
    'poster synopsis synopsis '
    'poster stream stream'
    'poster skip skip';
    'icon icon icon'
    'icon icon icon';
  border-radius: ${space(2)};
  
  & > *:not(:last-child), & > :last-child > * {
    background-color: ${color('gray', 100)};
    animation: skeleton-loading 1s linear infinite alternate;

    @keyframes skeleton-loading {
      0% {
        opacity: 20%;
      }

      100% {
        opacity: 40%;
      }
    }
  }
`;

const Title = styled.div`
  grid-area: 1 / 2 / 2 / 5;
  margin: ${space(0)};
  height: 20px;
`;

const Poster = styled.div`
  grid-area: 1 / 1 / 5 / 2;
  display: grid;
  position: relative;
  margin-right: ${space(3)};
  height: 116px;
`;

const Synopsis = styled.div`
  grid-area: 2 / 2 / 3 / 5;
  margin-bottom: ${space(1)};
  height: 20px;
`;

const StreamRatingBar = styled.div`
  grid-area: 3 / 2 / 4 / 5;
  height: 12px;
`;

const SkipRatingBar = styled.div`
  grid-area: 4 / 2 / 5 / 5;
  height: 12px;
`;

const ThumbIconContainer = styled.div`
  grid-area: 5 / 1 / 6 / 5;
  display: flex;
  justify-content: space-around;
  padding: 0 ${space(5)};
  margin-top: ${space(4)};
`;
const ThumbIcon = styled.div`
  width: 50px;
  height: 50px;
`;

export default function LoadingSkeleton() {
  return (
    <CardContainer>
      <Card>
        <Poster />
        <Title />
        <Synopsis />
        <StreamRatingBar />
        <SkipRatingBar />
        <ThumbIconContainer>
          <ThumbIcon />
          <ThumbIcon />
        </ThumbIconContainer>
      </Card>
    </CardContainer>
  );
}
