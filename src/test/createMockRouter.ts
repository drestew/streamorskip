import { NextRouter, Router } from 'next/router';
import { BaseRouter } from 'next/dist/shared/lib/router/router';

export function createMockRouter(router: Partial<NextRouter>): NextRouter {
  return <
    BaseRouter &
      Pick<
        Router,
        | 'push'
        | 'replace'
        | 'reload'
        | 'back'
        | 'forward'
        | 'prefetch'
        | 'beforePopState'
        | 'events'
        | 'isFallback'
        | 'isReady'
        | 'isPreview'
      >
  >{
    query: {},
    push: () => Promise,
    category: 'series',
    genre: 'All Genres',
    ...router,
  };
}
