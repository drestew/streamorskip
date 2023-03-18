import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { CatalogList } from '@features/catalog';

export default {
  title: 'Catalog Card',
  component: CatalogList,
} as ComponentMeta<typeof CatalogList>;

const Template: ComponentStory<typeof CatalogList> = (args) => (
  <CatalogList border={args.border}>Click Me</CatalogList>
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
