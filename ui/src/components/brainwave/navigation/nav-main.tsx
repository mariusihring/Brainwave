import { ChevronRight } from "lucide-react";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { type Item, useNavStore } from "@/lib/stores/nav";
import { Link } from "@tanstack/react-router";

export function NavMain() {
	const { navMain } = useNavStore();

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Platform</SidebarGroupLabel>
			<SidebarMenu>
				{navMain.map((item) => (
					<div key={item.title}>
						{item.isGroup ? (
							<GroupItem item={item} />
						) : (
							<NormalItem item={item} />
						)}
					</div>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}

function NormalItem({ item }: { item: Item }) {
	const { getIcon } = useNavStore();
	const Icon = getIcon(item.iconName);

	return (
		<SidebarMenuButton asChild tooltip={item.title}>
			<Link to={item.url}>
				{Icon ? <Icon /> : null}
				<span>{item.title}</span>
			</Link>
		</SidebarMenuButton>
	);
}

function GroupItem({ item }: { item: Item }) {
	const { getIcon, updateToggleState } = useNavStore();
	const Icon = getIcon(item.iconName);
	return (
		<Collapsible key={item.title} asChild defaultOpen={item.isActive}>
			<SidebarMenuItem>
				<SidebarMenuButton asChild tooltip={item.title}>
					<Link to={item.url}>
						{Icon ? <Icon /> : null}
						<span>{item.title}</span>
					</Link>
				</SidebarMenuButton>
				{item.items?.length ? (
					<>
						<CollapsibleTrigger asChild>
							<SidebarMenuAction className="data-[state=open]:rotate-90">
								<ChevronRight onClick={() => updateToggleState(item)} />
								<span className="sr-only">Toggle</span>
							</SidebarMenuAction>
						</CollapsibleTrigger>
						<CollapsibleContent>
							<SidebarMenuSub>
								{item.items?.map((subItem) => {
									return (
										<SidebarMenuSubItem key={subItem.title}>
											<SidebarMenuSubButton asChild>
												<Link to={subItem.url}>
													<span>{subItem.title}</span>
												</Link>
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>
									);
								})}
							</SidebarMenuSub>
						</CollapsibleContent>
					</>
				) : null}
			</SidebarMenuItem>
		</Collapsible>
	);
}
