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
  const [savedList, setSavedList] = React.useState<
    { catalog_item: number }[] | null
  >(null);

  React.useEffect(() => {
    getUserRatings();

    async function getUserRatings() {
      if (!user) {
        //  setUserRatings(null);
        await queryClient.resetQueries(['catalog-default']);
        return null;
      }

      //   const { data, error } = await supabase
      //     .from('rating')
      //     .select('user_id, catalog_item, stream')
      //     .eq('user_id', user.id);
      //
      //   if (error) {
      //     console.log('Error:', {
      //       message: error.message,
      //       details: error.details,
      //     });
      //   }
      //   setUserRatings(data);
    }
  }, [queryClient, supabase, user]);

  const loadingSkeletonArr: React.ReactNode[] = new Array(10)
    .fill('')
    .map((item, index) => {
      return (
        <li key={index}>
          <LoadingSkeleton />
        </li>
      );
    });

  React.useEffect(() => {
    getSavedList();
    async function getSavedList() {
      const { data: titles } = await supabase
        .from('saved_list')
        .select('catalog_item')
        .eq('user_id', 'b13d8037-d874-4d84-8aed-317a12fa4829');
      setSavedList(titles);
    }
  }, [supabase]);

  return (
    <List role="list">
      {status === 'loading' && <List>{loadingSkeletonArr}</List>}
      {catalog?.pages.map((group, i) => (
        <React.Fragment key={i}>
          {group?.filteredData?.map((item, index) => {
            // const ratingIndex = userRatings?.find(
            //   (ratingItem) => ratingItem.catalog_item === item.nfid
            //   // (ratedItem) => ratedItem.catalog_item === item.nfid
            // );
            return (
              <li key={item.nfid}>
                <CatalogCard
                  title={item.title}
                  synopsis={item.synopsis}
                  img={item.img}
                  rating={item.rating === null ? 0 : item.rating}
                  stream={user ? true : null}
                  // stream={user && ratingIndex ? ratingIndex.stream : null}
                  nfid={item.nfid}
                  priorityImg={index === 0}
                  modalState={modalState}
                  queryClient={queryClient}
                  supabase={supabase}
                  user={user}
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
