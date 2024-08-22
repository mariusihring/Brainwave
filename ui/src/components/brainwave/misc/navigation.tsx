import BrainwaveLogo from "@/components/brainwave/misc/logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { useSettings } from "@/lib/stores/settings.ts";
import { cn } from "@/lib/utils";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
	DiamondIcon,
	GraduationCapIcon,
	HomeIcon,
	ListChecksIcon,
	PanelLeftCloseIcon,
	PanelRightCloseIcon,
	PenLineIcon,
	PuzzleIcon,
} from "lucide-react";
import { type ReactNode, useState } from "react";

const iconSize = 20;
const sideMenuStaticLinks = [
	{
		icon: <HomeIcon size={iconSize} />,
		label: "Dashboard",
		href: "/",
	},
	{
		icon: <GraduationCapIcon size={iconSize} />,
		label: "Semesters",
		href: "/semester",
	},
	{
		icon: <PuzzleIcon size={iconSize} />,
		label: "Courses",
		href: "/courses",
	},
	{
		icon: <ListChecksIcon size={iconSize} />,
		label: "To-Do's",
		href: "/todos",
	},
	{
		icon: <PenLineIcon size={iconSize} />,
		label: "Notebooks",
		href: "/notes",
	},
	{
		icon: <DiamondIcon size={iconSize} />,
		label: "Flashcards",
		href: "/flashcards",
	},
];

export default function Navigation({ children }: { children: ReactNode }) {
	const router = useRouterState();
	const pathname = router.location.pathname;
	const settings = useSettings();
	const isCurrentPath = (link: string) => {
		if (pathname === link) {
			return "default";
		}
		return "ghost";
	};
	return (
		<main className="flex min-h-dvh gap-4 p-2">
			<aside className="flex flex-col items-center justify-between border-r p-2">
				{settings.nav_open ? (
					<div className="flex my-5 gap-2 items-center justify-center pl-1">
						<BrainwaveLogo className="w-8 h-8" />
						<h1 className="font-bold text-xl">Brainwave</h1>
					</div>
				) : (
					<BrainwaveLogo className="w-8 h-8" />
				)}
				<div
					data-collapsed={true}
					className="group flex h-full flex-col gap-4 py-2 data-[collapsed=true]:py-2 w-full mt-5"
					style={{ justifyContent: "space-between" }}
				>
					<nav className="grid  w-full gap-1  group-[data-collapsed=true]:justify-center group-[data-collapsed=true]:px-2">
						{sideMenuStaticLinks.map((link, index) =>
							!settings.nav_open ? (
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								<Tooltip key={index} delayDuration={0}>
									<TooltipTrigger asChild>
										<Link
											to={link.href}
											className={cn(
												buttonVariants({
													variant: isCurrentPath(link.href),
													size: "icon",
												}),
												"h-9 w-9",
												isCurrentPath(link.href) === "default" &&
													"dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
											)}
										>
											{link.icon}
											<span className="sr-only">{link.label}</span>
										</Link>
									</TooltipTrigger>
									<TooltipContent
										side="right"
										className="flex items-center gap-4"
									>
										{link.label}
									</TooltipContent>
								</Tooltip>
							) : (
								<Link
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									key={index}
									to={link.href}
									className={cn(
										buttonVariants({
											variant: isCurrentPath(link.href),
											size: "sm",
										}),
										isCurrentPath(link.href) === "default" &&
											"dark:bg-muted dark:hover:bg-muted dark:text-white dark:hover:text-white",
										"justify-start gap-3 w-full",
									)}
								>
									{link.icon}
									{link.label}
								</Link>
							),
						)}
					</nav>
				</div>
			</aside>

			<div className="flex flex-1 flex-col ">
				<nav className="mb-6 flex items-center justify-between">
					<div className="flex gap-4">
						<Button
							variant="ghost"
							size="icon"
							className="-ml-2"
							onClick={() => settings.setNav(!settings.nav_open)}
						>
							{settings.nav_open ? (
								<PanelLeftCloseIcon strokeWidth={1.5} size={18} />
							) : (
								<PanelRightCloseIcon strokeWidth={1.5} size={18} />
							)}
						</Button>
						<Input />
					</div>
					<div className="flex items-center gap-4" />
				</nav>
				<Outlet />
			</div>
		</main>
	);
}
