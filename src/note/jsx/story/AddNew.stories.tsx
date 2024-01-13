import type { Meta, StoryObj } from '@storybook/react';
import { NoteJSX } from '../../..';

import { StoreDecorator } from '../../../stories';

import { AddNew } from '../addNew';

const meta = {
  title: 'Note/AddNew',
  component: AddNew,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [StoreDecorator, Layout],
  argTypes: {},
} satisfies Meta<typeof AddNew>;

function Layout(Story: () => JSX.Element) {
  return (
    <div>
      <NoteJSX.List />
      <Story />
    </div>
  )
}

export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {},
};
