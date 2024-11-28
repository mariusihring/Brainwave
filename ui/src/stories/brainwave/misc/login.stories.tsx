import type { Meta, StoryObj } from "@storybook/react";

import Login from "@/components/brainwave/misc/login";

/**
  The login Page of Brainwave
 */
const meta = {
	title: "Brainwave/Misc/Login",
	component: Login,
	tags: ["autodocs"],
	argTypes: {},
	parameters: {
		layout: "centered",
	},
	args: {},
} satisfies Meta<typeof Login>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
