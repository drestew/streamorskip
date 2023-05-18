import { useRouter } from 'next/router';

export type ContentFilters = {
  category?: string;
  genre?: string;
};

export function useFilters() {
  const router = useRouter();

  const filters = {
    category: !router.query.category ? 'movie' : router.query.category,
    genre: !router.query.genre ? '%%' : `%${router.query.genre}%`,
  } as ContentFilters;

  function handleFilters(newFilters: ContentFilters) {
    const query = { ...router.query, ...newFilters };
    router.push({ query });
    return { router };
  }

  return { filters, handleFilters };
}
