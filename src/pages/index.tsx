import { CatalogList, getCatalog, useUserRating } from '@features/catalog';
import { InferGetStaticPropsType } from 'next';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Category } from '@features/category/category';
import { useFilters } from '../hooks/useFilter';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { Genre } from '@features/genre/genre';

export default function Home({
  catalog,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const userRatings = useUserRating();
  const { filters } = useFilters();
  let category: string, genre: string;
  if (filters.category) {
    category = filters.category;
  }
  if (filters.genre) {
    genre = filters.genre;
  }
  const { data, fetchNextPage, status } = useInfiniteQuery({
    queryKey: ['catalog-default', filters.category, filters.genre],
    queryFn: ({ pageParam }) =>
      getCatalog({ pageParam: pageParam }, category, genre),
    getNextPageParam: (lastPage) => lastPage.step,
    initialData: { pages: [catalog], pageParams: [] },
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return (
    <main>
      {status && userRatings.status === 'loading' ? (
        // {userRatings ? (
        <p>Under Construction</p>
      ) : (
        <>
          <Category category={filters.category} />
          {/*<Genre />*/}
          <CatalogList catalog={data} userRatings={userRatings} />
        </>
      )}
      <h1 ref={ref} style={{ color: 'white', margin: 'auto' }}>
        Loading...
      </h1>
    </main>
  );
}

export const getStaticProps = async () => {
  const catalog = await getCatalog({ pageParam: 0 }, 'movie', 'All Genres');

  return { props: { catalog } };
};
