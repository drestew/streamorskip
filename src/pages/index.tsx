import { CatalogList, getCatalog } from '@features/catalog';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { Category } from '@features/filters';
import { useFilters } from '@features/filters';
import { useInView } from 'react-intersection-observer';
import React from 'react';
import { Genre } from '@features/filters';
import styled from 'styled-components';
import { space } from '@styles/theme';
import { Header } from '@components/Header/Header';
import { Modal } from '@components/Modal/Modal';
import { Search } from '@features/filters/components/Search/Search';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Database } from '@src/types/supabase';

const PageContainer = styled.div`
  max-width: 400px;
  margin: auto;
  padding: ${space(3)} ${space(4)};
  border: red 1px solid;
`;

const SearchContainer = styled.div`
  margin-bottom: ${space(6)};
`;

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
`;

const CatalogContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  margin: auto;
`;

const Filters = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default function Home() {
  const { filters } = useFilters();
  const [modalOpen, setModalOpen] = React.useState(false);
  let category: string, genre: string, search: string;
  const queryClient = useQueryClient();
  const supabase = useSupabaseClient<Database>();
  const [userId, setUserId] = React.useState<string | null>(null);
  React.useEffect(() => {
    getSession();

    async function getSession() {
      const session = await supabase.auth.getSession();
      session.data.session && setUserId(session.data.session.user.id);
    }
  }, [supabase.auth]);

  if (filters.category) {
    category = filters.category;
  }
  if (filters.genre) {
    genre = filters.genre;
  }
  if (filters.search) {
    search = filters.search;
  }

  const { data, fetchNextPage, isFetching, hasNextPage, status } =
    useInfiniteQuery({
      queryKey: [
        'catalog-default',
        filters.category,
        filters.genre,
        filters.search,
        userId,
      ],
      queryFn: ({ pageParam }) =>
        getCatalog({ pageParam: pageParam }, category, genre, search),
      getNextPageParam: (lastPage) => lastPage.step,
      refetchOnWindowFocus: false,
    });

  const { ref, inView } = useInView();

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  React.useEffect(() => {
    // to not duplicate search result in catalogList
    queryClient.resetQueries([
      'catalog-default',
      filters.category,
      filters.genre,
      filters.search,
    ]);
  }, [filters.search]);

  function openModal() {
    if (modalOpen) {
      return setModalOpen(false);
    }
    setModalOpen(true);
  }

  return (
    //<h1>Site under construction</h1>
    <PageContainer>
      {modalOpen && <Modal modalOpen={modalOpen} />}
      <Header userId={userId} />
      <MainContent>
        <SearchContainer>{<Search />}</SearchContainer>
        <Filters>
          <Category category={filters.category} />
          <Genre genre={filters.genre} />
        </Filters>
        <CatalogContainer>
          <CatalogList
            catalog={data}
            isFetching={isFetching}
            status={status}
            modalState={openModal}
            userId={userId}
          />
        </CatalogContainer>
        <div ref={ref}></div>
      </MainContent>
    </PageContainer>
  );
}
