import { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'Button',
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    color: 'primary',
    shade: 300,
    size: 'md',
    children: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    color: 'secondary',
    shade: 300,
    size: 'md',
    children: 'Button',
  },
};

export const Gray: Story = {
  args: {
    color: 'gray',
    shade: 300,
    size: 'md',
    children: 'Button',
  },
};

export const Small: Story = {
  args: {
    color: 'primary',
    shade: 300,
    size: 'sm',
    children: 'Button',
  },
};

export const Medium: Story = {
  args: {
    color: 'primary',
    shade: 300,
    size: 'md',
    children: 'Button',
  },
};

export const Large: Story = {
  args: {
    color: 'primary',
    shade: 300,
    size: 'lg',
    children: 'Button',
  },
};
