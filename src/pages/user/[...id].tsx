import { CatalogList } from '@features/catalog';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import React from 'react';
import { getUsersList } from '@features/catalog/api/getUserSavedList';
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
  const router = useRouter();
  const supabase = useSupabaseClient<Database>();
  const [userId, setUserId] = React.useState<string | undefined>('');

  const { id } = router.query;
  React.useEffect(() => {
    async function getUserId() {
      if (id) {
        const user = await supabase.auth.getUser();
        if (user) {
          setUserId(user.data.user?.id);
        }
      }
    }
    getUserId();
  }, [id, supabase.auth]);

  const { data, fetchNextPage, isFetching, hasNextPage, status } =
    useInfiniteQuery({
      queryKey: ['my-list', userId],
      queryFn: ({ pageParam }) =>
        getUsersList({ pageParam: pageParam }, supabase, userId),
      getNextPageParam: (lastPage) => lastPage.step,
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
      <Header />
      <MainContent>
        <CatalogContainer>
          <CatalogList
            catalog={data}
            isFetching={isFetching}
            modalState={() => false}
            status={status}
          />
        </CatalogContainer>
        <div ref={ref}></div>
      </MainContent>
    </PageContainer>
  );
}
