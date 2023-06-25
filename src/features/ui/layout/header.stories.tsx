import { Meta, StoryObj } from '@storybook/react';
import Layout from './header';
import { SignupForm } from '@features/auth/components/signup-form/signup-form';

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
