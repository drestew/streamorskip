import { CatalogList, getCatalog } from '@features/catalog';
import { InferGetStaticPropsType } from 'next';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Category } from '@features/category/category';
import { useFilters } from '../hooks/useFilter';
import { useInView } from 'react-intersection-observer';
import React from 'react';
import { Genre } from '@features/genre/genre';
import styled from 'styled-components';
import { space } from '@styles/theme';
import Header from '@features/ui/layout/header';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

const PageContainer = styled.div`
  max-width: 400px;
  margin: auto;
  padding: ${space(3)};
  border: red 1px solid;
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
  const { filters } = useFilters();
  const [loggedIn, setLoggedIn] = React.useState(false);
  const supabase = useSupabaseClient();
  let category: string, genre: string;
  const session = useSession();

  if (filters.category) {
    category = filters.category;
  }
  if (filters.genre) {
    genre = filters.genre;
  }
  const { data, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['catalog-default', filters.category, filters.genre, loggedIn],
    queryFn: ({ pageParam }) =>
      getCatalog({ pageParam: pageParam }, category, genre),
    getNextPageParam: (lastPage) => lastPage.step,
    placeholderData: { pages: [catalog], pageParams: [] },
    refetchOnWindowFocus: false,
  });

  const { ref, inView } = useInView();

  React.useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  React.useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') setLoggedIn(true);
      if (event === 'SIGNED_OUT') setLoggedIn(false);
    });
  }, [supabase.auth]);

  return (
    <PageContainer>
      <Header isFetching={isFetching} />
      <MainContent>
        <Filters>
          <Category category={filters.category} />
          <Genre genre={filters.genre} />
        </Filters>
        <CatalogContainer>
          <CatalogList
            catalog={data}
            isFetching={isFetching}
            session={session}
          />
        </CatalogContainer>
        <h1 ref={ref} style={{ color: 'white', margin: 'auto' }}>
          Loading...
        </h1>
      </MainContent>
    </PageContainer>
  );
}

export const getStaticProps = async () => {
  const catalog = await getCatalog({ pageParam: 11 }, 'movie', 'All Genres');

  return { props: { catalog } };
};
