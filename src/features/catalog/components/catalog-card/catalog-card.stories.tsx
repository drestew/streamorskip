import { ComponentStory, ComponentMeta } from '@storybook/react';
import { CatalogCard } from '../../index';

export default {
  title: 'Catalog Card',
  component: CatalogCard,
} as ComponentMeta<typeof CatalogCard>;

const Template: ComponentStory<typeof CatalogCard> = (args) => {
  return (
    <CatalogCard
      title={args.title}
      synopsis={args.synopsis}
      rating={args.rating}
      img={args.img}
      stream={args.stream}
      nfid={args.nfid}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  title: 'Mighty Morphin Power Rangers',
  synopsis:
    'Five average teens are chosen by an intergalactic wizard to become the Power Rangers, who must use their new powers to fight the evil Rita Repulsa.',
  rating: 6.4,
  img: 'https://occ-0-2851-38.1.nflxso.net/dnm/api/v6/evlCitJPPCVCry0BZlEFb5-QjKc/AAAABVQvr2do2ukNtPmRSP3F5r0T_2TzFuPaYrYgL5du6wL2D3JvKPtySMSfYu9BEVuUJEmKaxHVx1mKWAxkMhm_rCRi1Q.jpg?r=04f',
  stream: null,
};

export const Stream = Template.bind({});
Stream.args = {
  ...Default.args,
  stream: true,
};

export const Skip = Template.bind({});
Skip.args = {
  ...Default.args,
  stream: false,
};
