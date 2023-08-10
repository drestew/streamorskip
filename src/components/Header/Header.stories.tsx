import { Meta, StoryObj } from '@storybook/react';
import { Header } from './Header';

const meta: Meta<typeof Header> = {
  title: 'Header',
  component: Header,
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Mobile: Story = {
  render: () => <Header isFetching={false} />,
};
