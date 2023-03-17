import { useQuery } from '@tanstack/react-query';

async function getCatalog() {
  return await fetch('https://api.github.com/repos/tannerlinsley/react-query');
}
export function useCatalog(): any {
  return useQuery(['catalog'], getCatalog);
}
