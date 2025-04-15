"use client";

import { usePathname } from "next/navigation";
import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";

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

const FreshMarker = ({ children }: { children: React.ReactNode }) => (
    <span
        aria-label="Active"
        title="Active"
        className="font-bold bg-accent/20 rounded-sm px-1.5 py-0.5 text-accent-foreground border-l-2 border-accent"
    >
        {children}
    </span>
);

function isActivePath(currentPath: string, itemUrl: string) {
    return currentPath === itemUrl || currentPath.startsWith(itemUrl + "/");
}

export function NavMain({
    items,
    openItems,
    onToggleItem,
}: {
    items: {
        title: string;
        url: string;
        icon: LucideIcon;
        items?: {
            title: string;
            url: string;
        }[];
    }[];
    openItems?: string[];
    onToggleItem?: (title: string) => void;
}) {
    const pathname = usePathname();

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const mainActive = isActivePath(pathname, item.url);
                    const isOpen =
                        openItems?.includes(item.title) || mainActive;

                    return (
                        <Collapsible
                            key={item.title}
                            asChild
                            open={isOpen}
                            defaultOpen={mainActive}
                        >
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    tooltip={item.title}
                                    onClick={(e) => {
                                        if (onToggleItem) {
                                            e.preventDefault();
                                            onToggleItem(item.title);
                                        }
                                    }}
                                >
                                    <Link href={item.url}>
                                        <item.icon />
                                        <span>
                                            {mainActive ? (
                                                <FreshMarker>
                                                    {item.title}
                                                </FreshMarker>
                                            ) : (
                                                item.title
                                            )}
                                        </span>
                                    </Link>
                                </SidebarMenuButton>
                                {item.items?.length ? (
                                    <>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuAction className="data-[state=open]:rotate-90">
                                                <ChevronRight />
                                                <span className="sr-only">
                                                    Toggle
                                                </span>
                                            </SidebarMenuAction>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item.items.map((subItem) => {
                                                    const subActive =
                                                        isActivePath(
                                                            pathname,
                                                            subItem.url
                                                        );
                                                    return (
                                                        <SidebarMenuSubItem
                                                            key={subItem.title}
                                                        >
                                                            <SidebarMenuSubButton
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={
                                                                        subItem.url
                                                                    }
                                                                >
                                                                    <span>
                                                                        {subActive ? (
                                                                            <FreshMarker>
                                                                                {
                                                                                    subItem.title
                                                                                }
                                                                            </FreshMarker>
                                                                        ) : (
                                                                            subItem.title
                                                                        )}
                                                                    </span>
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
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
