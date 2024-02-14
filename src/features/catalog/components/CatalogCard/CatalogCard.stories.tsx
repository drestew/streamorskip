import { Meta, StoryObj } from '@storybook/react';
import { CatalogCard } from '../../index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const queryClient = new QueryClient();
const meta: Meta<typeof CatalogCard> = {
  title: 'Catalog Card',
  component: CatalogCard,
  decorators: [
    (Story) => (
      <div style={{ width: 600 }}>
        <QueryClientProvider client={queryClient}>
          {Story()}
        </QueryClientProvider>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CatalogCard>;

export const Default: Story = {
  args: {
    title: 'Mighty Morphin Power Rangers',
    synopsis:
      'Five average teens are chosen by an intergalactic wizard to become the Power Rangers, who must use their new powers to fight the evil Rita Repulsa.',
    img: 'https://occ-0-2851-38.1.nflxso.net/dnm/api/v6/evlCitJPPCVCry0BZlEFb5-QjKc/AAAABVQvr2do2ukNtPmRSP3F5r0T_2TzFuPaYrYgL5du6wL2D3JvKPtySMSfYu9BEVuUJEmKaxHVx1mKWAxkMhm_rCRi1Q.jpg?r=04f',
    savedList: [],
    priorityImg: true,
    userId: '123',
    signupModalOpen: undefined,
    userRatings: [],
    nfid: 70184128,
    streamCount: 523,
    skipCount: 182,
    trailer: 'https://www.imdb.com/video/imdb/vi2601165849/imdb/embed',
  },
};

export const Stream: Story = {
  args: {
    ...Default.args,
    userRatings: [{ user_id: 'abc123', catalog_item: 70184128, stream: true }],
  },
};

export const Skip: Story = {
  args: {
    ...Default.args,
    userRatings: [{ user_id: 'abc123', catalog_item: 70184128, stream: false }],
  },
};

export const Saved: Story = {
  args: {
    ...Default.args,
    savedList: [{ catalog_item: 70184128 }],
  },
};
