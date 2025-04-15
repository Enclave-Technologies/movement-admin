"use client";

import { usePathname } from "next/navigation";
import { type LucideIcon } from "lucide-react";

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

const FreshMarker = () => (
    <span
        aria-label="Active"
        title="Active"
        className="ml-1 text-red-500"
        style={{ fontSize: "1.2em" }}
    >
        🏋️‍♂️
    </span>
);

function isActivePath(currentPath: string, itemUrl: string) {
    return currentPath === itemUrl || currentPath.startsWith(itemUrl + "/");
}

export function NavSecondary({
    items,
    ...props
}: {
    items: {
        title: string;
        url: string;
        icon: LucideIcon;
    }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
    const pathname = usePathname();

    return (
        <SidebarGroup {...props}>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => {
                        const active = isActivePath(pathname, item.url);
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild size="sm">
                                    <a href={item.url}>
                                        <item.icon />
                                        <span>
                                            {item.title}
                                            {active && <FreshMarker />}
                                        </span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
