import { CatalogList, getSavedList } from '@features/catalog';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import React from 'react';
import styled from 'styled-components';
import { space } from '@styles/theme';
import { Header } from '@components/Header/Header';
import { Database } from '@src/types/supabase';
import { useRouter } from 'next/router';

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

const CatalogContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`;

export default function SavedList() {
  const supabase = useSupabaseClient<Database>();
  const [userId, setUserId] = React.useState<string | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    getSession();

    async function getSession() {
      const session = await supabase.auth.getSession();
      session.data.session && setUserId(session.data.session.user.id);
    }
  }, [supabase.auth]);

  const { data, fetchNextPage, isFetching, hasNextPage, status } =
    useInfiniteQuery({
      queryKey: ['my-list', userId],
      queryFn: ({ pageParam }) =>
        getSavedList({ pageParam: pageParam }, supabase, userId),
      getNextPageParam: (lastPage) => lastPage?.step,
      refetchOnWindowFocus: false,
    });

  const { ref, inView } = useInView();

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') {
      router.push('/');
    }
  });

  return (
    <PageContainer>
      <Header userId={userId} supabase={supabase} />
      <MainContent>
        <CatalogContainer>
          <CatalogList
            catalog={data}
            isFetching={isFetching}
            status={status}
            userId={userId}
          />
        </CatalogContainer>
        <div ref={ref}></div>
      </MainContent>
    </PageContainer>
  );
}
