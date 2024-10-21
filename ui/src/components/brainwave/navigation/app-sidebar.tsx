import * as React from "react";
import {
  BookOpen,
  Calendar,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Pen,
  Home,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

import { useUser } from "@/lib/stores/user";
import { NavMain } from "@/components/brainwave/navigation/nav-main";
import { NavProjects } from "@/components/brainwave/navigation/nav-projects";
import { NavSecondary } from "@/components/brainwave/navigation/nav-secondary";
import { NavUser } from "@/components/brainwave/navigation/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
      isGroup: false,
    },
    {
      title: "Calendar",
      url: "/calendar",
      icon: Calendar,
      isGroup: false,
    },
    {
      title: "University",
      url: "#",
      icon: BookOpen,
      isGroup: true,
      isActive: true,
      items: [
        {
          title: "Semesters",
          url: "/semester",
        },
        {
          title: "Modules",
          url: "/modules",
        },
        {
          title: "Courses",
          url: "/courses",
        },
        {
          title: "Todos",
          url: "/todos",
        },
      ],
    },
    {
      title: "Notes",
      url: "#",
      icon: Pen,
      isGroup: true,
      isActive: true,
      items: [
        {
          title: "Markdown",
          url: "#",
        },
        {
          title: "Latex",
          url: "#",
        },
        {
          title: "Flashcards",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

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
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
