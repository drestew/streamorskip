import { useRouter } from 'next/router';

export type ContentFilters = {
  category: string;
};

export function useFilters() {
  const router = useRouter();

  const filters = {
    category: !router.query.category ? 'movie' : router.query.category,
  } as ContentFilters;

  function handleFilters(newFilters: ContentFilters) {
    const query = { ...router.query, ...newFilters };
    router.push({ query });
    return { router };
  }

  return { filters, handleFilters };
}
