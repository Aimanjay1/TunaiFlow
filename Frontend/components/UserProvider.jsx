// /UserProvider.jsx
"use client";
import { useRouter } from "next/navigation";
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import LoadingScreen from "./loading-screen";
import { NextResponse } from "next/server";

const UserContext = createContext(null);

export function UserProvider({ children, initialUser = null, fallback = null }) {
    const router = useRouter();
    const [user, setUser] = useState(initialUser);
    const [loading, setLoading] = useState(!initialUser);
    const [ready, setReady] = useState(!!initialUser); // NEW: block children until first check completes
    const [error, setError] = useState(null);

    const fetchMe = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/auth/me", { credentials: "include" });
            if (res.ok) {
                const data = await res.json();
                setUser(data);
            } else {
                setUser(null);
            }
        } catch (e) {
            setError(e);
            setUser(null);
        } finally {
            setLoading(false);
            setReady(true); // NEW
        }
    }, []);

    useEffect(() => {
        if (!initialUser) fetchMe();
        else setReady(true);
    }, [initialUser, fetchMe]);

    const login = useCallback(
        async (email, password) => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                    credentials: "include",
                });
                if (res.ok) {
                    await fetchMe();
                    return true;
                } else {
                    setError("Login failed");
                    return false;
                }
            } catch (e) {
                setError(e);
                return false;
            } finally {
                setLoading(false);
            }
        },
        [fetchMe]
    );

    const logout = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
        } catch (e) {
            setError(e);
        } finally {
            setUser(null);
            setLoading(false);
            router.replace("/auth/login");
        }
    }, [router]);

    // NEW: a fetch helper that auto-logs-out on 401
    const authedFetch = useCallback(
        async (input, init = {}) => {
            const res = await fetch(input, { credentials: "include", ...init });
            if (res.status === 401) {
                // Session expired while browsing — cleanly log out and redirect
                await logout();
                // throw new Error("Unauthorized");
                open("Unauthorized", 3000, "#f00")
            }
            return res;
        },
        [logout]
    );

    const value = useMemo(
        () => ({
            user,
            isAuthenticated: !!user,
            loading,
            ready,       // NEW
            error,
            login,
            logout,
            refresh: fetchMe,
            authedFetch, // NEW
        }),
        [user, loading, ready, error, login, logout, fetchMe, authedFetch]
    );

    // NEW: block children until first auth check completes (prevents UI flash)
    if (!ready) return fallback ?? <LoadingScreen />

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser must be used within UserProvider");
    return ctx;
}

// Optional: convenience wrapper to guard trees
export function RequireAuth({ children, fallback = null }) {
    const { ready, isAuthenticated, loading, logout } = useUser();

    useEffect(() => {
        if (ready && !loading && !isAuthenticated) {
            logout();
        }
    }, [isAuthenticated]);

    if (!ready || loading) return fallback ?? <LoadingScreen />;
    if (!isAuthenticated) return null;

    return children;
}
