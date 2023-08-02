import { Meta, StoryObj } from '@storybook/react';
import { Layout } from './Layout';
import { SignupForm } from '@features/auth/components/SignupForm/SignupForm';

const meta: Meta<typeof Layout> = {
  title: 'Auth/Layout',
  component: Layout,
};

export default meta;
type Story = StoryObj<typeof Layout>;

export const Mobile: Story = {
  render: () => (
    <Layout>
      <SignupForm />
    </Layout>
  ),
};
