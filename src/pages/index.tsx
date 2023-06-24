import { CatalogList, getCatalog, useUserRating } from '@features/catalog';
import { InferGetStaticPropsType } from 'next';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Category } from '@features/category/category';
import { useFilters } from '../hooks/useFilter';
import { useInView } from 'react-intersection-observer';
import React, { useEffect } from 'react';
import { Genre } from '@features/genre/genre';
import styled from 'styled-components';
import { Button } from '@features/ui/button/button';
import { space } from '@styles/theme';
import Link from 'next/link';

const PageContainer = styled.div`
  max-width: 400px;
  margin: auto;
  padding: ${space(3)};
  border: red 1px solid;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${space(8)};
`;

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  padding-left: ${space(4)};
  padding-right: ${space(4)};
`;

const CatalogContainer = styled.div`
  display: flex;
  justify-content: center;
  max-width: 400px;
  margin: auto;
`;

const Filters = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default function Home({
  catalog,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const userRatings = useUserRating();
  const { filters } = useFilters();
  let category: string, genre: string;
  if (filters.category) {
    category = filters.category;
  }
  if (filters.genre) {
    genre = filters.genre;
  }
  const { data, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['catalog-default', filters.category, filters.genre],
    queryFn: ({ pageParam }) =>
      getCatalog({ pageParam: pageParam }, category, genre),
    getNextPageParam: (lastPage) => lastPage.step,
    placeholderData: { pages: [catalog], pageParams: [] },
    refetchOnWindowFocus: false,
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return (
    <PageContainer>
      <Header>
        <h2 style={{ color: 'white' }}>Stream or Skip</h2>
        <Link href="/signup">
          <Button color="secondary" shade={300} size="md" role="link">
            Sign up
          </Button>
        </Link>
      </Header>
      <MainContent>
        {userRatings.status === 'loading' ? (
          <p>Under Construction</p>
        ) : (
          <>
            <Filters>
              <Category category={filters.category} />
              <Genre genre={filters.genre} />
            </Filters>
            <CatalogContainer>
              <CatalogList
                catalog={data}
                userRatings={userRatings}
                isFetching={isFetching}
              />
            </CatalogContainer>
          </>
        )}
        <h1 ref={ref} style={{ color: 'white', margin: 'auto' }}>
          Loading...
        </h1>
      </MainContent>
    </PageContainer>
  );
}

export const getStaticProps = async () => {
  const catalog = await getCatalog({ pageParam: 0 }, 'movie', 'All Genres');

  return { props: { catalog } };
};
