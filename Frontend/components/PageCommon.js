import { TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function TH({ children, className = "" }) {
    return <TableHead className={"text-center " + className}>{children}</TableHead>;
}

export function Cell({ children, className = "" }) {
    return <TableCell className={"text-center   " + className}>{children}</TableCell>;
}

export function PageButton({ children, href, className = "", variant = "identity", ...props }) {
    if (href) {
        return (
            <Link href={href} className={`bg-${variant} object flex p-2 text-background rounded-sm w-fit ${className}`} {...props}>
                {children}
            </Link>
        );
    }
    return (
        <Button className={`bg-${variant} object flex p-2 text-background rounded-sm w-fit ${className}`} {...props}>
            {children}
        </Button>
    );
}

export function PageLayout({ title, subtitle, children, action }) {
    return (
        <main className="flex flex-col h-min-full container mx-auto p-4">
            <div className="container mx-auto my-12">
                <h1 className="text-5xl font-bold mb-8">{title}</h1>
                {subtitle && <p>{subtitle}</p>}
            </div>
            {action && <div className="container mx-auto m-4">{action}</div>}
            {children}
        </main>
    );
}
