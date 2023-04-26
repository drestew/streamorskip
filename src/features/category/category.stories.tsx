import { Meta, StoryObj } from '@storybook/react';
import { Category } from './category';

const meta: Meta<typeof Category> = {
  title: 'Category',
  component: Category,
};

export default meta;
type Story = StoryObj<typeof Category>;

export const Movie: Story = {
  args: { category: 'movie' },
};

export const Series: Story = {
  args: { category: 'series' },
};
