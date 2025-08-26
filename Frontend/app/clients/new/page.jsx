"use client"
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toasts";
import { ArrowArcLeft } from "phosphor-react";
import { useUser } from "@/components/UserProvider";



function TH({ children }) {
    return (
        <TableHead className={"text-center"}>
            {children}
        </TableHead>
    )
}

function Cell({ children }) {
    return (
        <TableCell className={"text-center"}>
            {children}
        </TableCell>
    )
}

function ClientButton({ children }) {
    return (
        <Button className={"bg-identity-dillute hover:bg-identity"}>
            {children}
        </Button>
    )
}

export default function AddClient(props) {
    const { open } = useToast();
    const router = useRouter();
    const { authedFetch } = useUser()

    const form = useForm({
        defaultValues: {
            clientName: "",
            companyName: "",
            companyAddress: "",
            email: "",
            contactNumber: "",

            // idk abt these two
            // address: "",
            // profilePicture: null,
        },
        mode: "onSubmit",
    })

    const [preview, setPreview] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const watchName = form.watch("clientName") || ""
    const watchEmail = form.watch("email") || ""
    const errors = form.formState.errors
    const disableSubmit = isSubmitting || !watchName.trim() || !watchEmail.trim() || Object.keys(errors).length > 0;

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview)
        }
    }, [preview])

    async function onSubmit(values) {
        if (isSubmitting) return; // Prevent double submit
        setIsSubmitting(true);

        try {
            const res = await authedFetch(`/api/clients`, {
                method: "POST",
                body: JSON.stringify(values),
            });

            if (res.ok) {
                console.log(await res.json());
                open("Client created successfully!", 4000)
                router.replace("/clients")
            } else {
                console.error("❌❌❌ Failed to create client");
                open("Failed to create client!", 4000)
            }
        } catch (e) {
            console.error("Failed to load Clients,", e);
        } finally {
            setIsSubmitting(false);
        }
    }

    let Clients = [];
    return (
        <main className="flex flex-col h-min-full w-full ">
            {/* Decorative header with overlapping avatar and primary save button */}
            <section className="relative w-full">
                <div className="h-40 w-full bg-identity-blue shadow-sm p-4 flex items-start">
                    <div className="container mx-auto flex items-start justify-between">
                        <Button variant="ghost" size="lg" onClick={() => router.back()} className="text-white hover:bg-white/100 z-10">
                            <ArrowArcLeft />
                        </Button>
                        <h1 className="text-2xl text-white font-semibold text-center flex-1 -ml-12 z-0">Client Profile</h1>
                    </div>
                </div>
                <div className="absolute left-1/2 -bottom-16 -translate-x-1/2 flex flex-col items-center gap-3">
                    <div
                        role="button"
                        aria-label="Change avatar"
                        onClick={() => document.getElementById('avatar-upload')?.click()}
                        className="group relative"
                    >
                        <Avatar className="h-28 w-28 ring-4 ring-background shadow-lg bg-accent transition hover:brightness-105">
                            <AvatarImage src={preview || undefined} alt="Client avatar" />
                            <AvatarFallback className="text-xl">CL</AvatarFallback>
                        </Avatar>
                        <div className="pointer-events-none absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm font-medium transition">
                            Change
                        </div>
                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                if (preview) URL.revokeObjectURL(preview);
                                if (file) setPreview(URL.createObjectURL(file));
                            }}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button type="submit" form="add-client-form" disabled={disableSubmit} className="bg-identity-dillute hover:bg-identity shadow disabled:opacity-50 disabled:cursor-not-allowed">
                            Save
                        </Button>
                    </div>
                </div>
            </section>

            <div className="container max-w-2xl mx-auto mt-12">
                <Form {...form} >
                    <form id="add-client-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-full p-4">
                        <FormField
                            control={form.control}
                            name="clientName"
                            rules={{
                                required: "Client name is required",
                                minLength: { value: 2, message: "At least 2 characters" },
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Client's name"
                                            {...field}
                                            value={field.value ?? ""}
                                            aria-invalid={!!errors.clientName}
                                            className={errors.clientName ? "border-red-500 focus-visible:ring-red-500" : ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Company Name" {...field} value={field.value ?? ""} />
                                    </FormControl>
                                    {/* <FormDescription>The client's name.</FormDescription> */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="companyAddress"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Company Address" {...field} value={field.value ?? ""} />
                                    </FormControl>
                                    {/* <FormDescription>The client's name.</FormDescription> */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Company Address" {...field} value={field.value ?? ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}
                        <FormField
                            control={form.control}
                            name="email"
                            rules={{
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Invalid email format",
                                },
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Email"
                                            {...field}
                                            value={field.value ?? ""}
                                            aria-invalid={!!errors.email}
                                            className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Secondary save for when user scrolls beyond header */}
                        {/* <Button variant="outline" type="submit" disabled={disableSubmit} className="disabled:opacity-50 disabled:cursor-not-allowed">Save Changes</Button> */}
                    </form>
                </Form>
            </div>

        </main >
    )
}