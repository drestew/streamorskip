import { Meta, StoryObj } from '@storybook/react';
import { Search } from '@features/search/Search';

const meta: Meta<typeof Search> = {
  title: 'Search',
  component: Search,
};

export default meta;
type Story = StoryObj<typeof Search>;

export const Default: Story = {};
