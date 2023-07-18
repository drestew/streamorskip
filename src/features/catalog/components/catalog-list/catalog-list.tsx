import React from 'react';
import styled from 'styled-components';
import { CatalogCard } from '../../index';
import { color } from '@styles/theme';
import { InfiniteData } from '@tanstack/react-query';
import LoadingSkeleton from '@features/catalog/components/loading-skeleton/loading-skeleton';
import { Session } from '@supabase/gotrue-js';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

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
        step: number;
      }>
    | undefined;

  session: Session | null;
  isFetching: boolean;
};

export function CatalogList({
  catalog,
  isFetching,
  session,
}: CatalogListProps) {
  const user = useUser();
  const supabase = useSupabaseClient();
  const [userRatings, setUserRatings] = React.useState<
    { user_id: string; catalog_item: number; stream: boolean }[] | null
  >();

  React.useEffect(() => {
    getUserRatings();

    async function getUserRatings() {
      if (!user) {
        return null;
      }

      const { data, error } = await supabase
        .from('rating')
        .select('user_id, catalog_item, stream')
        .eq('user_id', user.id);

      if (error) {
        console.log('Error:', {
          message: error.message,
          details: error.details,
        });
      }
      setUserRatings(data);
    }
  }, [session, supabase, user]);

  function getItemRating(nfid: number) {
    const ratedItem = userRatings?.filter((item) => item.catalog_item === nfid);
    return ratedItem && ratedItem.length > 0 ? ratedItem[0].stream : null;
  }

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
      {isFetching && <List>{loadingSkeletonArr}</List>}
      {catalog?.pages.map((group, i) => (
        <React.Fragment key={i}>
          {group.filteredData?.map((item, index) => {
            const itemRating = getItemRating(item.nfid);
            return (
              <li key={item.nfid}>
                <CatalogCard
                  title={item.title}
                  synopsis={item.synopsis}
                  img={item.img}
                  rating={item.rating === null ? 0 : item.rating}
                  stream={itemRating}
                  nfid={item.nfid}
                  priorityImg={index === 0}
                />
              </li>
            );
          })}
          {isFetching && <List>{loadingSkeletonArr}</List>}
        </React.Fragment>
      ))}
    </List>
  );
}
