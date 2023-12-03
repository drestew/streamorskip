import styled from 'styled-components';

const Iframe = styled.iframe`
  width: 80vw;
  height: calc(80vw * 0.5625); // 16:9 aspect ratio
  border: none;

  @media (min-width: 750px) {
    width: 65vw;
    height: calc(65vw * 0.5625);
  }

  @media (min-width: 1100px) {
    width: 50vw;
    height: calc(50vw * 0.5625);
  }
`;

export function Trailer({
  title,
  trailer,
}: {
  title: string;
  trailer: string | null;
}) {
  return <Iframe id="trailer" title={title} src={trailer || ''}></Iframe>;
}
