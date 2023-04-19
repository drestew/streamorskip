import { CatalogList, getCatalog, useUserRating } from '@features/catalog';
import { InferGetStaticPropsType } from 'next';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useViewportBottom } from '@features/catalog/hooks/useViewportBottom';

export default function Home({
  catalog,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const userRatings = useUserRating();
  const { data, fetchNextPage, status } = useInfiniteQuery({
    queryKey: ['catalog-default'],
    queryFn: getCatalog,
    getNextPageParam: (lastPage) => lastPage?.step,
    initialData: { pages: [catalog], pageParams: [] },
  });

  useViewportBottom() && fetchNextPage();

  return (
    <main>
      <p>Site Under Construction</p>
      {status && userRatings.status === 'loading' ? (
        <p>Loading...</p>
      ) : (
        <CatalogList catalog={data} userRatings={userRatings} />
      )}
    </main>
  );
}

export const getStaticProps = async () => {
  const catalog = await getCatalog({ pageParam: 0 });
  return { props: { catalog } };
};
