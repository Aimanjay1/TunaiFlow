import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
    useSidebar
} from "@/components/ui/sidebar"
import Link from "next/link"
import LogoutButton from "./LogoutButton"
import { useIsMobile } from "@/hooks/use-mobile"
import { Separator } from "./ui/separator";
import { useUser } from "./UserProvider";
import { Avatar } from "./ui/avatar";

export function AppSidebar() {
    const sidebar = useSidebar();
    const isMobile = useIsMobile();

    function handleSidebarToggle() {
        if (isMobile) sidebar.toggleSidebar();
    }
    const { user, refresh } = useUser()



    return (

        <Sidebar >
            <SidebarHeader >
                <SidebarGroup >
                    {/* <h1 className="flex w-full font-bold text-2xl text-identity"><Link href={"/"}>TunaiFlow</Link></h1> */}
                    <div className=" pr-4 flex items-center gap-2" >
                        {user && user.email && user.name ? (
                            <>
                                <Avatar className={"bg-accent border-2 h-6 w-6 lg:h-8 lg:w-8 justify-center"} src={null}>{user ? (user.name.charAt(0) + user.name.charAt(1) || "-") : "-"}</Avatar>
                                <div className="text-sm flex flex-col justify-center">
                                    <p className="font-bold ">{user ? (user.name || "-") : "-"}</p>
                                    <p className="text-ellipsis">{user ? (user.email || "-") : "-"}</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <Avatar className={"bg-accent border-2 h-6 w-6 lg:h-8 lg:w-8 justify-center"} src={null}>!</Avatar>
                                <div className="text-sm flex flex-col justify-center">
                                    <p className="font-bold ">Unauthorized</p>
                                    <p className="text-ellipsis">Unauthorized</p>
                                </div>
                            </>
                        )
                        }
                    </div>
                </SidebarGroup>
            </SidebarHeader>
            <Separator />
            <SidebarContent>
                <SidebarGroup >
                    <SidebarMenu>

                        <SidebarMenuItem>
                            <SidebarMenuButton>
                                <Link href={"/dashboard"} onClick={handleSidebarToggle} className="flex w-full">Dashboard</Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <Separator className={"px-2 my-2"} />
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton>
                                <Link href={"/invoices"} onClick={handleSidebarToggle} className="flex w-full">Invoices</Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton>
                                <Link href={"/clients"} onClick={handleSidebarToggle} className="flex w-full">Clients</Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton>
                                <Link href={"/financial-logbook"} onClick={handleSidebarToggle} className="flex w-full">Financial Logbook</Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarGroup>
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <Link href={"/financial-logbook/revenues"} onClick={handleSidebarToggle} className="flex w-full">Revenues</Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <Link href={"/financial-logbook/expenses"} onClick={handleSidebarToggle} className="flex w-full">Expenses</Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarGroup>
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter>
                <LogoutButton />
            </SidebarFooter>
        </Sidebar>
    )
}
