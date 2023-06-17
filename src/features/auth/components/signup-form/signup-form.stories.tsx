import { Meta, StoryObj } from '@storybook/react';
import { SignupForm } from './signup-form';

const meta: Meta<typeof SignupForm> = {
  title: 'Signup Form',
  component: SignupForm,
};

export default meta;
type Story = StoryObj<typeof SignupForm>;

export const Default: Story = {};
