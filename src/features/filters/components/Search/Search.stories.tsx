import { Meta, StoryObj } from '@storybook/react';
import { Search } from '@features/filters/components/Search/Search';
import { within, userEvent } from '@storybook/testing-library';
import React from 'react';

const meta: Meta<typeof Search> = {
  title: 'Search',
  component: Search,
  decorators: [(Story) => <div style={{ width: 600 }}>{Story()}</div>],
};

export default meta;
type Story = StoryObj<typeof Search>;

export const Default: Story = {};

export const WithText: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const searchInput = await canvas.getByText('Search for a movie or series.');
    await userEvent.type(searchInput, 'the last dance', { delay: 200 });
  },
};
