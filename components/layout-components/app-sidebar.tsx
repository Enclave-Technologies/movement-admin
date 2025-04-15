"use client";

import * as React from "react";
import {
    // BookOpen,
    // Bot,
    Dumbbell,
    // Command,
    // Frame,
    // LifeBuoy,
    // Map,
    MountainIcon,
    // PieChart,
    // Send,
    Settings2,
    // SquareTerminal,
    UserCircle,
    Users,
} from "lucide-react";

import { NavMain } from "@/components/layout-components/nav-main";
// import { NavProjects } from "@/components/layout-components/nav-projects";
// import { NavSecondary } from "@/components/layout-components/nav-secondary";
import { NavUser } from "@/components/layout-components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

// Define the user data structure based on NavUser component
export interface UserData {
    name: string;
    email: string;
    avatar: string;
}

// Define props interface including the user data
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: UserData;
}

// Keep navMain static for now, or make it a prop too if needed
// Removed user from here
const navMain = [
    {
        title: "Clients",
            url: "#",
            icon: Users, // Consider an icon representing multiple users
            isActive: true,
            items: [
                {
                    title: "My Clients",
                    url: "#",
                },
                {
                    title: "All Clients",
                    url: "#",
                },
                {
                    title: "Add/Onboard Users",
                    url: "#",
                },
            ],
        },
        {
            title: "Coaches",
            url: "#",
            icon: UserCircle,
            items: [
                {
                    title: "All Coaches",
                    url: "#",
                },
            ],
        },
        {
            title: "Library",
            url: "#",
            icon: Dumbbell,
            items: [
                {
                    title: "Exercises",
                    url: "#",
                },
                // {
                //     title: "Get Started",
                //     url: "#",
                // },
                // {
                //     title: "Tutorials",
                //     url: "#",
                // },
                // {
                //     title: "Changelog",
                //     url: "#",
                // },
            ],
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "General",
                    url: "#",
                },
                {
                    title: "Team",
                    url: "#",
                },
                {
                    title: "Billing",
                    url: "#",
                },
                {
                    title: "Limits",
                    url: "#",
                },
            ],
        },
]; // End of navMain array definition
// Removed stray closing brace from original 'data' object below
    // navSecondary: [
    //     {
    //         title: "Support",
    //         url: "#",
    //         icon: LifeBuoy,
    //     },
    //     {
    //         title: "Feedback",
    //         url: "#",
    //         icon: Send,
    //     },
    // ],
    // projects: [
    //     {
    //         name: "Design Engineering",
    //         url: "#",
    //         icon: Frame,
    //     },
    //     {
    //         name: "Sales & Marketing",
    //         url: "#",
    //         icon: PieChart,
    //     },
    //     {
    //         name: "Travel",
    //         url: "#",
    //         icon: Map,
    //     },
    // ],
// Removed stray closing brace from original 'data' object above

export function AppSidebar({ user, ...props }: AppSidebarProps) { // Updated function signature
    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <MountainIcon className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        GymFlow
                                    </span>
                                    <span className="truncate text-xs">
                                        Movement Fitness
                                    </span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMain} /> {/* Use navMain constant */}
                {/* <NavProjects projects={data.projects} />
                <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} /> {/* Use user prop */}
            </SidebarFooter>
        </Sidebar>
    );
}
