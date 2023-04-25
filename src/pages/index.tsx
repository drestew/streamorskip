import { CatalogList, getCatalog, useUserRating } from '@features/catalog';
import { InferGetStaticPropsType } from 'next';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useViewportBottom } from '@features/catalog/hooks/useViewportBottom';
import { Category } from '@features/category/category';
import { useFilters } from '../hooks/useFilter';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

export default function Home({
  catalog,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const userRatings = useUserRating();
  const { filters } = useFilters();
  const { data, fetchNextPage, status } = useInfiniteQuery({
    queryKey: ['catalog-default', filters.category],
    queryFn: ({ pageParam }) =>
      getCatalog({ pageParam: pageParam }, filters.category),
    getNextPageParam: (lastPage) => lastPage.step,
    initialData: { pages: [catalog], pageParams: [] },
  });

  const { ref, inView } = useInView();
  useViewportBottom() && fetchNextPage();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return (
    <main>
      <p>Site Under Construction</p>
      {status && userRatings.status === 'loading' ? (
        <p>Loading...</p>
      ) : (
        <>
          <Category category={filters.category} />
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
  const catalog = await getCatalog({ pageParam: 0 }, 'movie');
  return { props: { catalog } };
};
