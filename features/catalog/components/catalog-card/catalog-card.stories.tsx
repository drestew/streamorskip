import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { CatalogCard } from '@features/catalog';

export default {
  title: 'Catalog Card',
  component: CatalogCard,
} as ComponentMeta<typeof CatalogCard>;

const Template: ComponentStory<typeof CatalogCard> = (args) => {
  return (
    <CatalogCard
      title="Mighty Morphin Power Rangers"
      synopsis="Five average teens are chosen by an intergalactic wizard to become the Power Rangers, who must use their new powers to fight the evil Rita Repulsa."
      rating={6.4}
      img="https://occ-0-2851-38.1.nflxso.net/dnm/api/v6/evlCitJPPCVCry0BZlEFb5-QjKc/AAAABVQvr2do2ukNtPmRSP3F5r0T_2TzFuPaYrYgL5du6wL2D3JvKPtySMSfYu9BEVuUJEmKaxHVx1mKWAxkMhm_rCRi1Q.jpg?r=04f"
    />
  );
};

export const Default = Template.bind({});
Default.args = {};
