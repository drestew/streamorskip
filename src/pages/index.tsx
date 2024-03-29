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
import { useRouter } from 'next/router';
import { SignupForm } from '@features/auth';

const PageContainer = styled.div`
  margin: auto;
  padding: ${space(3)} ${space(4)};
`;

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  margin: auto;

  @media (min-width: 550px) {
    width: 80%;
  }

  @media (min-width: 1100px) {
    width: 60%;
  }
`;

const Filters = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const SearchBox = styled.div`
  width: 100%;
  margin-bottom: ${space(6)};

  @media (min-width: 1100px) {
    order: 2;
    margin-bottom: 0;
    width: 50%;
  }
`;

const Categories = styled.div`
  justify-self: center;
  align-self: flex-start;

  @media (min-width: 1100px) {
    order: 1;
  }
`;

const Genres = styled.div`
  justify-self: center;
  align-self: flex-end;

  @media (min-width: 1100px) {
    order: 3;
  }
`;

const CatalogContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`;

export default function Home() {
  const { filters } = useFilters();
  const [signupModalOpen, setSignupModalOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const supabase = useSupabaseClient<Database>();
  const [userId, setUserId] = React.useState<string | null>(null);
  const [category, setCategory] = React.useState<string>('');
  const [genre, setGenre] = React.useState<string>('');
  const [search, setSearch] = React.useState<string>('');
  const router = useRouter();

  React.useEffect(() => {
    getSession();

    async function getSession() {
      const session = await supabase.auth.getSession();
      session.data.session && setUserId(session.data.session.user.id);
    }
  }, [supabase.auth]);

  React.useEffect(() => {
    if (filters.category) {
      setCategory(filters.category);
    }
    if (filters.genre) {
      setGenre(filters.genre);
    }
    if (filters.search) {
      setSearch(filters.search);
    } else {
      // need to reset state so that default catalog will be re-fetched
      setSearch('');
      delete router.query.search;
    }
  }, [filters.category, filters.genre, filters.search]);

  const { data, fetchNextPage, isFetching, hasNextPage, status } =
    useInfiniteQuery({
      queryKey: ['catalog-default', category, genre, search, userId],
      queryFn: ({ pageParam }) =>
        getCatalog(
          { pageParam: pageParam },
          category,
          genre,
          search,
          userId,
          supabase
        ),
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

  function openSignupModal() {
    if (signupModalOpen) {
      return setSignupModalOpen(false);
    }
    setSignupModalOpen(true);
  }

  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') {
      setUserId(null);
    }
  });

  return (
    <PageContainer>
      <Modal modalOpen={signupModalOpen} openChange={openSignupModal}>
        <SignupForm />
      </Modal>
      <Header userId={userId} supabase={supabase} />
      <MainContent>
        <Filters>
          <SearchBox>{<Search />}</SearchBox>
          <Categories>
            <Category category={filters.category} />
          </Categories>
          <Genres>
            <Genre genre={filters.genre} />
          </Genres>
        </Filters>
        <CatalogContainer>
          <CatalogList
            catalog={data}
            isFetching={isFetching}
            status={status}
            signupModalOpen={openSignupModal}
            userId={userId}
          />
        </CatalogContainer>
        <div ref={ref}></div>
      </MainContent>
    </PageContainer>
  );
}
