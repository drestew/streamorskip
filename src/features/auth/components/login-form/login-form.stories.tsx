import { Meta, StoryObj } from '@storybook/react';
import { LogInForm } from './login-form';

const meta: Meta<typeof LogInForm> = {
  title: 'Auth/Login Form',
  component: LogInForm,
};

export default meta;
type Story = StoryObj<typeof LogInForm>;

export const Mobile: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};
