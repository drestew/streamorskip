import React from 'react';
import styled from 'styled-components';
import { CatalogCard } from '@features/catalog';
import { color, space } from '@styles/theme';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { LoadingSkeleton } from '@features/catalog/components/LoadingSkeleton/LoadingSkeleton';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Database } from '@src/types/supabase';

const List = styled.ul`
  background-color: ${color('dark', 300)};
  list-style: none;
  padding: 0;
`;

const NoContent = styled.h2`
  color: white;
  text-align: center;
  margin-top: ${space(10)};
`;

type CatalogListProps = {
  catalog:
    | InfiniteData<{
        filteredData:
          | {
              nfid: number;
              title: string;
              img: string;
              synopsis: string;
              rating: number | null;
              vtype: string;
              on_Nflix: boolean;
              stream_count: number;
              skip_count: number;
            }[]
          | null;
        step: number | null;
      } | null>
    | undefined;

  isFetching: boolean;
  modalState: () => void;
  status: string;
  userId: string | null;
};

export function CatalogList({
  catalog,
  isFetching,
  status,
  modalState,
  userId,
}: CatalogListProps) {
  const supabase = useSupabaseClient<Database>();
  const queryClient = useQueryClient();
  const [userRatings, setUserRatings] = React.useState<
    { user_id: string; catalog_item: number; stream: boolean }[] | null
  >(null);
  const [savedList, setSavedList] = React.useState<
    { catalog_item: number }[] | null
  >(null);

  React.useEffect(() => {
    getUserRatings();

    async function getUserRatings() {
      if (!userId) {
        setUserRatings(null);
        await queryClient.resetQueries(['catalog-default']);
        return null;
      }

      const { data, error } = await supabase
        .from('rating')
        .select('user_id, catalog_item, stream')
        .eq('user_id', userId);

      if (error) {
        console.log('Error getting user ratings:', {
          message: error.message,
          details: error.details,
        });
      }

      setUserRatings(data);
    }
  }, [queryClient, supabase, userId]);

  React.useEffect(() => {
    getSavedList();
    async function getSavedList() {
      if (userId) {
        const { data, error } = await supabase
          .from('saved_list')
          .select('catalog_item')
          .eq('user_id', userId);

        if (error) {
          console.log('Error getting saved list:', {
            message: error.message,
            details: error.details,
          });
        }

        setSavedList(data);
      }
    }
  }, [supabase, userId]);

  const loadingSkeletonArr: React.ReactNode[] = new Array(10)
    .fill('')
    .map((item, index) => {
      return (
        <li key={index}>
          <LoadingSkeleton />
        </li>
      );
    });

  return (
    <List role="list">
      {status === 'loading' && <List>{loadingSkeletonArr}</List>}
      {catalog ? (
        catalog.pages.map((group, i) => (
          <React.Fragment key={i}>
            {group?.filteredData?.map((item, index) => {
              return (
                <li key={item.nfid}>
                  <CatalogCard
                    title={item.title}
                    synopsis={item.synopsis}
                    img={item.img}
                    rating={item.rating === null ? 0 : item.rating}
                    nfid={item.nfid}
                    streamCount={item.stream_count}
                    skipCount={item.skip_count}
                    priorityImg={index === 0}
                    modalState={modalState}
                    queryClient={queryClient}
                    supabase={supabase}
                    userId={userId}
                    userRatings={userRatings}
                    setUserRatings={setUserRatings}
                    savedList={savedList}
                    setSavedList={setSavedList}
                  />
                </li>
              );
            })}
            {/* only display loadingSkeleton if at the end of infinite scroll,
          pageParams will be greater than 1 if there is more data to show */}
            {isFetching && catalog?.pageParams?.length !== 1 && (
              <List>{loadingSkeletonArr}</List>
            )}
          </React.Fragment>
        ))
      ) : (
        <NoContent>Empty!</NoContent>
      )}
    </List>
  );
}
