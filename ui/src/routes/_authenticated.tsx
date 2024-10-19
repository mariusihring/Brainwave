import { useAuth } from "@/auth";
import { AppSidebar } from "@/components/brainwave/navigation/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import QuickActions from "@/components/brainwave/misc/quick_actions.tsx";
import { useUser } from "@/lib/stores/user";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_authenticated")({
  component: () => {
    const { setUser } = useUser();
    const navigate = useNavigate();

    async function checkAuth() {
      const auth = await useAuth();
      setUser(auth.user);
      if (!auth.session || !auth.user) {
        navigate({ to: "/login" });
      }
    }

    // biome-ignore lint/correctness/useExhaustiveDependencies: should run only when the page gets refreshed
    useEffect(() => {
      checkAuth();
    }, []);

    return (
      <div className="">
        <QuickActions>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="#">
                          Building Your Application
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              </header>
              <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <Outlet />
              </div>
            </SidebarInset>
          </SidebarProvider>
        </QuickActions>
        <ReactQueryDevtools />
      </div>
    );
  },
});
