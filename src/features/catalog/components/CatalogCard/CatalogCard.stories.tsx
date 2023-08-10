import { Meta, StoryObj } from '@storybook/react';
import { CatalogCard } from '../../index';

const meta: Meta<typeof CatalogCard> = {
  title: 'Catalog Card',
  component: CatalogCard,
};

export default meta;
type Story = StoryObj<typeof CatalogCard>;

export const Default: Story = {
  args: {
    title: 'Mighty Morphin Power Rangers',
    synopsis:
      'Five average teens are chosen by an intergalactic wizard to become the Power Rangers, who must use their new powers to fight the evil Rita Repulsa.',
    rating: 6.4,
    img: 'https://occ-0-2851-38.1.nflxso.net/dnm/api/v6/evlCitJPPCVCry0BZlEFb5-QjKc/AAAABVQvr2do2ukNtPmRSP3F5r0T_2TzFuPaYrYgL5du6wL2D3JvKPtySMSfYu9BEVuUJEmKaxHVx1mKWAxkMhm_rCRi1Q.jpg?r=04f',
    stream: null,
  },
};

export const Stream: Story = {
  args: {
    ...Default.args,
    stream: true,
  },
};

export const Skip: Story = {
  args: {
    ...Default.args,
    stream: false,
  },
};
