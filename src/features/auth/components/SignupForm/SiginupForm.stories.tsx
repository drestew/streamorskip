import { Meta, StoryObj } from '@storybook/react';
import { SignupForm } from './SignupForm';

const meta: Meta<typeof SignupForm> = {
  title: 'Auth/Signup Form',
  component: SignupForm,
};

export default meta;
type Story = StoryObj<typeof SignupForm>;

export const Mobile: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};
