import { Meta, StoryObj } from '@storybook/react';
import { LoadingSkeleton } from './LoadingSkeleton';

const meta: Meta<typeof LoadingSkeleton> = {
  title: 'Loading Skeleton',
  component: LoadingSkeleton,
};

export default meta;
type Story = StoryObj<typeof LoadingSkeleton>;

export const Default: Story = {};
