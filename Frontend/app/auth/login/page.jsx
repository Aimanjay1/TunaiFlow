"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toasts";
import { useUser } from "@/components/UserProvider";


export default function Login() {
  const { open } = useToast();
  const router = useRouter();
  const { login, loading } = useUser();

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (await login(email, password)) {
      open("Login successful.", 3000);
      router.replace("/dashboard");
    } else {
      open("Login failed. Please check your credentials.", 3000, "#ff0000");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-orange-100 to-white">
      <div className="w-full max-w-md rounded-xl shadow-lg bg-white p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold">
            Tunai<span className="text-orange-500">Flow</span>
          </h1>
          <p className="text-sm text-gray-600 mt-2">Urusan tertunai, semua flawless</p>
        </div>
        {/* Tabs */}
        <div className="flex justify-center mb-6 border-b border-orange-200">
          <Link href="/auth/login" className="px-6 py-2 text-orange-500 font-semibold border-b-2 border-orange-500 focus:outline-none">
            Login
          </Link>
          <Link href="/auth/signup" className="px-6 py-2 text-gray-400 font-semibold border-b-2 focus:outline-none hover:text-orange-500">
            Sign up
          </Link>
        </div>
        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <Input type="email" name="email" id="email" placeholder="Email" required className="mt-1 w-full" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <Input type="password" name="password" id="password" placeholder="Password" required className="mt-1 w-full" />
          </div>
          {/* <Link href="/" className="block w-full"> */}
          <Button data-slot="button" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded shadow" type="submit" disabled={loading}>{!loading ? "LOGIN" : "loading..."}</Button>
          {/* </Link> */}
        </form>
      </div>
    </div>
  );
}