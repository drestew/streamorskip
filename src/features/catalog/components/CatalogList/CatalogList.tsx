import React from 'react';
import styled from 'styled-components';
import { CatalogCard } from '@features/catalog';
import { color } from '@styles/theme';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { LoadingSkeleton } from '@features/catalog/components/LoadingSkeleton/LoadingSkeleton';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { Database } from '@src/types/supabase';

const List = styled.ul`
  background-color: ${color('dark', 300)};
  list-style: none;
  padding: 0;
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
            }[]
          | null;
        step: number | null;
      }>
    | undefined;

  isFetching: boolean;
  modalState: () => void;
  status: string;
};

export function CatalogList({
  catalog,
  isFetching,
  status,
  modalState,
}: CatalogListProps) {
  const user = useUser();
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
      if (!user) {
        setUserRatings(null);
        await queryClient.resetQueries(['catalog-default']);
        return null;
      }

      const { data, error } = await supabase
        .from('rating')
        .select('user_id, catalog_item, stream')
        .eq('user_id', user.id);

      if (error) {
        console.log('Error getting user ratings:', {
          message: error.message,
          details: error.details,
        });
      }

      setUserRatings(data);
    }
  }, [queryClient, supabase, user]);

  React.useEffect(() => {
    getSavedList();
    async function getSavedList() {
      if (user) {
        const { data, error } = await supabase
          .from('saved_list')
          .select('catalog_item')
          .eq('user_id', user.id);

        if (error) {
          console.log('Error getting saved list:', {
            message: error.message,
            details: error.details,
          });
        }

        setSavedList(data);
      }
    }
  }, [supabase, user]);

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
      {catalog?.pages.map((group, i) => (
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
                  priorityImg={index === 0}
                  modalState={modalState}
                  queryClient={queryClient}
                  supabase={supabase}
                  user={user}
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
      ))}
    </List>
  );
}
