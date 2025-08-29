import { SpinnerGap } from "phosphor-react";
export default function LoadingScreen() {
    return (
        <div className="p-8 w-full flex h-screen absolute text-center justify-center items-center z-0">
            <p className="absolute z-10">Loading…</p>
            <div className="animate-spin absolute z-0 text-[100px] text-identity "><SpinnerGap /></div>
        </div>
    )
}