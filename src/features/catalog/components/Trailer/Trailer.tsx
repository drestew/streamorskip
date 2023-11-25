import styled from 'styled-components';

const Iframe = styled.iframe`
  width: 300px;
  height: 200px;
  border: none;
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
