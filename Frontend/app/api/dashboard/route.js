import { NextResponse } from "next/server";

export async function GET(request) {
    const token = request.cookies.get(process.env.COOKIE_NAME)?.value;

    try {
        const [expenseRes, revenueRes] = await Promise.all([
            fetch(`${process.env.BACKEND_URL}/api/Expenses`, {
                headers: { Authorization: `Bearer ${token}` },
                cache: "no-store",
            }),
            fetch(`${process.env.BACKEND_URL}/api/Revenues`, {
                headers: { Authorization: `Bearer ${token}` },
                cache: "no-store",
            }),
        ]);

        // Graceful fallbacks if backend errors
        const expenses = expenseRes.ok ? await expenseRes.json() : [];
        const revenues = revenueRes.ok ? await revenueRes.json() : [];

        // Aggregate calculations
        const totalRevenue = revenues.reduce((s, r) => s + (r.amount || 0), 0);
        const totalExpenses = expenses.reduce((s, e) => s + (e.amount || 0), 0);
        const netProfit = totalRevenue - totalExpenses;
        const revenueGoal = 100000; // TODO: make dynamic/user configurable

        // Monthly series (index 0 = Jan)
        const revenueSeries = Array(12).fill(0);
        const expenseSeries = Array(12).fill(0);
        revenues.forEach(r => {
            const m = new Date(r.date).getMonth();
            revenueSeries[m] += r.amount || 0;
        });
        expenses.forEach(e => {
            const m = new Date(e.date).getMonth();
            expenseSeries[m] += e.amount || 0;
        });

        // Top spending categories (very naive classifier – replace when backend provides category)
        const categoryTotals = {};
        expenses.forEach(e => {
            const desc = (e.description || "").toLowerCase();
            let cat = "Other";
            if (/burger|food|meal|restaurant|chicken/.test(desc)) cat = "Food";
            categoryTotals[cat] = (categoryTotals[cat] || 0) + (e.amount || 0);
        });
        const totalCat = Object.values(categoryTotals).reduce((s, v) => s + v, 0) || 1;
        const topSpendingCategories = Object.entries(categoryTotals)
            .map(([category, amount]) => ({ category, amount, percent: +(amount / totalCat * 100).toFixed(2) }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5);

        const response = {
            summary: {
                totalRevenue,
                totalExpenses,
                netProfit,
                profitMarginPct: +(netProfit / (totalRevenue || 1) * 100).toFixed(2),
                revenueGoal,
                revenueGoalProgressPct: +(totalRevenue / (revenueGoal || 1) * 100).toFixed(2),
                burnRate: totalExpenses, // simplistic: this period expenses
                expenseRatioPct: +(totalExpenses / (totalRevenue || 1) * 100).toFixed(2),
            },
            monthSeries: { revenue: revenueSeries, expenses: expenseSeries },
            latest: {
                lastRevenue: revenues[revenues.length - 1] || null,
                lastExpense: expenses[expenses.length - 1] || null,
            },
            topSpendingCategories,
            revenues,
            expenses,
        };

        return NextResponse.json(response);
    } catch (err) {
        return NextResponse.json(
            { error: "Failed to build dashboard" },
            { status: 500 }
        );
    }
}