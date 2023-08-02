import { Meta, StoryObj } from '@storybook/react';
import { Genre } from './Genre';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient();
const meta: Meta<typeof Genre> = {
  title: 'Genre',
  component: Genre,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>{Story()}</QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Genre>;

export const Default: Story = {};
