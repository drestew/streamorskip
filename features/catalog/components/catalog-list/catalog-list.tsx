import React from 'react';
import styled from 'styled-components';
import { getCatalog, CatalogCard } from '@features/catalog';
import { useInfiniteQuery } from '@tanstack/react-query';
import { color } from '@styles/theme';

const List = styled.ul`
  background-color: ${color('dark', 300)};
  list-style: none;
`;
export function CatalogList() {
  const { data, fetchNextPage, status } = useInfiniteQuery({
    queryKey: ['catalog-default'],
    queryFn: getCatalog,
    getNextPageParam: (lastPage) => lastPage.step,
  });
  const [isBottom, setIsBottom] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const windowHeight =
        'innerHeight' in window
          ? window.innerHeight
          : document.documentElement.offsetHeight;
      const body = document.body;
      const html = document.documentElement;
      const docHeight = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );
      const windowBottom = windowHeight + window.scrollY;

      if (windowBottom >= docHeight) {
        setIsBottom(true);
      } else {
        setIsBottom(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  isBottom && fetchNextPage();

  return status === 'loading' ? (
    <p>Loading...</p>
  ) : (
    <List role="list">
      {data?.pages.map((group, i) => (
        <React.Fragment key={i}>
          {group.data?.map((item) => (
            <li key={item.nfid}>
              <CatalogCard
                title={item.title}
                synopsis={item.synopsis}
                img={item.img}
                rating={item.rating}
              />
            </li>
          ))}
        </React.Fragment>
      ))}
    </List>
  );
}
