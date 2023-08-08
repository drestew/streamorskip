import { CatalogList, getCatalog } from '@features/catalog';
import { InferGetStaticPropsType } from 'next';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Category } from '@features/filters';
import { useFilters } from '@features/filters';
import { useInView } from 'react-intersection-observer';
import React from 'react';
import { Genre } from '@features/filters';
import styled from 'styled-components';
import { space } from '@styles/theme';
import { Header } from '@components/Header/Header';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Modal } from '@components/Modal/Modal';

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
  const [modalOpen, setModalOpen] = React.useState(false);
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

  function openModal() {
    if (modalOpen) {
      return setModalOpen(false);
    }
    setModalOpen(true);
  }

  return (
    <PageContainer>
      {modalOpen && <Modal modalOpen={modalOpen} />}
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
            modalState={openModal}
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
