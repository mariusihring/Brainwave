import { Link } from "@tanstack/react-router";
import { Command } from "lucide-react";
import type * as React from "react";

import BrainwaveLogo from "@/components/brainwave/misc/logo.tsx";
import { NavMain } from "@/components/brainwave/navigation/nav-main";
import NavProjects from "@/components/brainwave/navigation/nav-projects";
import { NavUser } from "@/components/brainwave/navigation/nav-user";
import { Calendar } from "@/components/ui/calendar";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUser } from "@/lib/stores/user";
import { useState } from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { user } = useUser();

	return (
		<Sidebar variant="inset" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link to="/">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									<Command className="size-4" />
									{/*<BrainwaveLogo className="h-8 bg-white" />*/}
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">Brainwave</span>
									<span className="truncate text-xs">{user?.username}</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain />
				{/* <NavProjects /> */}
				{/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
				<DatePicker />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	);
}

function DatePicker() {
	const [date, setDate] = useState<Date>(new Date());
	return (
		<SidebarGroup className="px-0 mt-auto">
			<SidebarGroupContent>
				<Calendar
					mode="single"
					selected={date}
					showOutsideDays={false}
					hideNavigation={true}
					disableNavigation={true}
					className="[&_[role=gridcell].bg-accent]:bg-sidebar-primary [&_[role=gridcell].bg-accent]:text-sidebar-primary-foreground [&_[role=gridcell]]:w-[31px]"
				/>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
