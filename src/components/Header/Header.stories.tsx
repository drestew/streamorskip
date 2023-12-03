import { Meta, StoryObj } from '@storybook/react';
import { Header } from './Header';
import { supabaseClient } from '@utils/supabase-client';

const meta: Meta<typeof Header> = {
  title: 'Header',
  component: Header,
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Mobile: Story = {
  render: () => <Header userId={null} supabase={supabaseClient} />,
};
