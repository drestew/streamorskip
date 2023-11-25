import { CatalogList, getUserRatings } from '@features/catalog';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import React from 'react';
import styled, { css } from 'styled-components';
import { color, space } from '@styles/theme';
import { Header } from '@components/Header/Header';
import { Database } from '@src/types/supabase';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { useRouter } from 'next/router';

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

const ContentToggle = styled(ToggleGroup.Item)<{ ['data-state']: boolean }>`
  color: white;
  padding: ${space(1)} ${space(2)};
  border-radius: ${space(2)};
  border: none;
  background-color: ${color('gray', 300)};
  box-shadow: inset 5px 5px 10px ${color('gray', 100)},
    inset -5px -5px 10px ${color('gray', 500)};

  ${(props) => {
    if (props.value === 'stream') {
      return css`
        border-bottom-right-radius: revert;
        border-top-right-radius: revert;
      `;
    }
    if (props.value === 'skip') {
      return css`
        border-bottom-left-radius: revert;
        border-top-left-radius: revert;
      `;
    }
  }}
  ${(props) => {
    if (props['data-state'] === true) {
      return css`
        background-color: ${color('secondary', 300)};
        box-shadow: inset 5px 5px 10px ${color('secondary', 500)},
          inset -5px -5px 10px ${color('secondary', 300)};
        text-shadow: 0 0 10px ${color('gray', 500)};
      `;
    }
  }}
`;

export default function UserRatingsList() {
  const [value, setValue] = React.useState<string>('stream');
  const supabase = useSupabaseClient<Database>();
  const [userId, setUserId] = React.useState<string | null>(null);
  const router = useRouter();
  const selected = true;

  React.useEffect(() => {
    getSession();

    async function getSession() {
      const session = await supabase.auth.getSession();
      session.data.session && setUserId(session.data.session.user.id);
    }
  }, [supabase.auth]);

  const { data, fetchNextPage, isFetching, hasNextPage, status } =
    useInfiniteQuery({
      queryKey: ['my-ratings', userId, value],
      queryFn: ({ pageParam }) =>
        getUserRatings({ pageParam: pageParam }, supabase, userId, value),
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
      <Header userId={userId} />
      <MainContent>
        <ToggleGroup.Root
          type="single"
          value={value}
          onValueChange={(value) => {
            if (value) setValue(value);
          }}
        >
          <ContentToggle
            value="stream"
            data-state={value === 'stream' ? selected : !selected}
            onClick={() => setValue('stream')}
          >
            Stream
          </ContentToggle>
          <ContentToggle
            value="skip"
            data-state={value === 'skip' ? selected : !selected}
            onClick={() => setValue('skip')}
          >
            Skip
          </ContentToggle>
        </ToggleGroup.Root>
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
