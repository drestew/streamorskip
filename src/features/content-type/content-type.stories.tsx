import { Meta, StoryObj } from '@storybook/react';
import { ContentType } from './content-type';
import { within, userEvent } from '@storybook/testing-library';

const meta: Meta<typeof ContentType> = {
  title: 'Content Type',
  component: ContentType,
};

export default meta;
type Story = StoryObj<typeof ContentType>;

export const Movie: Story = {
  args: { value: 'movie', ['data-state']: true },
};

export const Series: Story = {
  // args: { value: 'series', ['data-state']: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const series = canvas.getByText('Series');

    await userEvent.click(series);
  },
};
