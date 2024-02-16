import { Meta, StoryObj } from '@storybook/react';
import { Header } from './Header';
import { supabaseClient } from '@utils/supabase-client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const queryClient = new QueryClient();
const meta: Meta<typeof Header> = {
  title: 'Header',
  component: Header,
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
type Story = StoryObj<typeof Header>;

export const Mobile: Story = {
  render: () => <Header userId={null} supabase={supabaseClient} />,
};
