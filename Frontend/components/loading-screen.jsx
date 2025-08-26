import { SpinnerGap } from "phosphor-react";
export default function LoadingScreen() {
    return (
        <div className="p-8 w-full flex h-screen absolute from-identity-dillute to-background bg-linear-0 text-center justify-center items-center -z-20">
            <p className="absolute -z-0">Loading…</p>
            <div className="animate-spin absolute -z-10 text-[100px] text-identity "><SpinnerGap /></div>
        </div>
    )
}