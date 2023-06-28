import { Meta, StoryObj } from '@storybook/react';
import Menu from './menu';
import { userEvent, within } from '@storybook/testing-library';

const meta: Meta<typeof Menu> = {
  title: 'Menu',
  component: Menu,
};

export default meta;
type Story = StoryObj<typeof Menu>;

export const Closed: Story = {};

export const Open: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('combobox'));
  },
};
