"use client"
import { Avatar } from "@/components/ui/avatar";
import Link from "next/link";
import { SidebarTrigger } from "./ui/sidebar";
import { useUser } from "./UserProvider";
import { useEffect } from "react";

export default function Header(props) {
    const { user, refresh } = useUser()
    console.log("user,", user)

    return (
        <div className="flex w-full bg-accent py-4 items-center justify-between ">
            <div className="flex gap-4 px-2 ">
                {/* <Button className="bg-accent hover:bg-accent/20 hover:-translate-y-0.5 hover:shadow-xl">
                    <HamburgerMenuIcon className="text-primary w-8 h-8" />
                </Button> */}
                <SidebarTrigger className={"hover:-translate-y-[1px] hover:shadow-sm hover:cursor-pointer"} />
                <h1 className="flex w-full font-bold text-2xl text-identity"><Link href={"/"}>TunaiFlow</Link></h1>
            </div>

            <div className=" pr-4 flex items-center gap-2" >
                {user && user.email && user.name ? (
                    <>
                        <Link href="/profile" className="pr-4 flex items-center gap-2 hover:cursor-pointer">
                            <Avatar className={"bg-accent border-2 h-6 w-6 lg:h-8 lg:w-8 justify-center"} src={null}>{user ? (user.name.charAt(0) + user.name.charAt(1) || "-") : "-"}</Avatar>
                            {/* <div className="text-sm flex flex-col justify-center">
                            <p className="font-bold ">{user ? (user.name || "-") : "-"}</p>
                            <p className="text-ellipsis">{user ? (user.email || "-") : "-"}</p>
                            </div> */}
                        </Link>
                    </>
                ) : (
                    <>
                        <Link href="/profile" className="pr-4 flex items-center gap-2 hover:cursor-pointer">
                            <Avatar className={"bg-accent border-2 h-6 w-6 lg:h-8 lg:w-8"} src={null}>Unauthorized</Avatar>
                            <div className="text-sm flex flex-col justify-center">
                                <p className="font-bold ">Unauthorized</p>
                                <p className="text-ellipsis">Unauthorized</p>
                            </div>
                        </Link>
                    </>
                )
                }
            </div>
        </div>
    )
}
