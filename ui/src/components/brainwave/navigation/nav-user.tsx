import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { logout } from "@/lib/auth/functions.ts";
import { useUser } from "@/lib/stores/user";
import {
	Bell,
	ChevronsUpDown,
	LogOut,
	Settings,
	Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { check, Update } from "@tauri-apps/plugin-updater";
import { relaunch } from '@tauri-apps/plugin-process';

export function NavUser() {
	const { isMobile } = useSidebar();
	const { user } = useUser();
	const [contentLength, setContentLength] = useState(0);
	const [downloaded, setDownloaded] = useState(0);
	let updateAvailable: Update | null = null;
	async function update() {
	if (updateAvailable) {
			await updateAvailable.downloadAndInstall((event) => {
				switch (event.event) {
					case "Started":
						setContentLength(event.data.contentLength as number);
						console.log(
							`started downloading ${event.data.contentLength} bytes`,
						);
						break;
					case "Progress":
						setDownloaded(event.data.chunkLength);
						console.log(`downloaded ${downloaded} from ${contentLength}`);
						break;
					case "Finished":
						console.log("download finished");
						break;
				}
			});

			console.log("update installed");
			await relaunch();
		}
	}
	useEffect(() => {
		async function check_update() {
		const update = await check();
		if (update) {
		console.log(
			`found update ${update.version} from ${update.date} with notes ${update.body}`
		  );
		updateAvailable = update
		}
		}
		check_update()
	}, [updateAvailable]);
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 rounded-lg">
								{/* <AvatarImage src={undefined} alt={user?.username} /> */}
								<AvatarFallback className="rounded-lg">
									{user?.username.slice(0, 1)}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">{user?.username}</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									{/* <AvatarImage src={user.avatar} alt={user.name} /> */}
									<AvatarFallback className="rounded-lg">
										{user?.username.slice(0, 1)}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">
										{user?.username}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{updateAvailable && (
							<>
								<DropdownMenuGroup>
									<DropdownMenuItem>
										<Sparkles />
										Update available!
										<Button>Download</Button>
									</DropdownMenuItem>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
							</>
						)}
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<Bell />
								Notifications
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Settings />
								Settings
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => logout()}>
							<LogOut />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
