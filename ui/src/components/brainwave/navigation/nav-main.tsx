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
import { Item, useNavStore } from "@/lib/stores/nav";

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
  let Icon = getIcon(item.iconName);
  return (
    <SidebarMenuButton asChild tooltip={item.title}>
      <a href={item.url}>
        {Icon ? <Icon /> : null}
        <span>{item.title}</span>
      </a>
    </SidebarMenuButton>
  );
}

function GroupItem({ item }: { item: Item }) {
  const { getIcon, updateToggleState } = useNavStore();
  let Icon = getIcon(item.iconName);
  return (
    <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip={item.title}>
          <a href={item.url}>
            {Icon ? <Icon /> : null}
            <span>{item.title}</span>
          </a>
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
                {item.items?.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton asChild>
                      <a href={subItem.url}>
                        <span>{subItem.title}</span>
                      </a>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </>
        ) : null}
      </SidebarMenuItem>
    </Collapsible>
  );
}
