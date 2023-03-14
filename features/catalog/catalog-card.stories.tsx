import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { CatalogCard } from './catalog-card';

export default {
  title: 'Catalog Card',
  component: CatalogCard,
} as ComponentMeta<typeof CatalogCard>;

const Template: ComponentStory<typeof CatalogCard> = (args) => (
  <CatalogCard border={args.border}>{args.children}</CatalogCard>
);

export const Default = Template.bind({});
Default.args = {
  border: 'red',
  children: 'Click Me',
};

export const Secondary = Template.bind({});
Secondary.args = {
  border: 'blue',
  children: 'Click Me',
};
