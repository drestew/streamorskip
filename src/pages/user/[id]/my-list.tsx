import { CatalogList, getSavedList } from '@features/catalog';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import React from 'react';
import styled from 'styled-components';
import { space } from '@styles/theme';
import { Header } from '@components/Header/Header';
import { Database } from '@src/types/supabase';

const PageContainer = styled.div`
  max-width: 400px;
  margin: auto;
  padding: ${space(3)} ${space(4)};
  border: red 1px solid;
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

export default function SavedList() {
  const supabase = useSupabaseClient<Database>();
  const [userId, setUserId] = React.useState<string | null>(null);
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

  return (
    <PageContainer>
      <Header userId={userId} />
      <MainContent>
        <CatalogContainer>
          <CatalogList
            catalog={data}
            isFetching={isFetching}
            modalState={() => false}
            status={status}
            userId={userId}
          />
        </CatalogContainer>
        <div ref={ref}></div>
      </MainContent>
    </PageContainer>
  );
}
