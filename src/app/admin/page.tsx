import db from "@/app/lib/db";
import { Disc, DollarSign, Users, TrendingUp, TrendingDown, MoreHorizontal, FileText, CheckCircle, Clock, AlertCircle, IndianRupee } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
    // 1. Fetch Stats
    const tracksCount = db.prepare("SELECT COUNT(*) as count FROM tracks").get() as { count: number };
    const revenue = db.prepare("SELECT SUM(total) as total FROM orders WHERE status = 'COMPLETED'").get() as { total: number };
    const usersCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };

    // 2. Fetch Recent Orders
    const recentOrders = db.prepare(`
        SELECT 
            o.id, 
            o.total, 
            o.status, 
            o.created_at, 
            u.email, 
            u.first_name, 
            u.last_name 
        FROM orders o 
        LEFT JOIN users u ON o.user_id = u.id 
        ORDER BY o.created_at DESC 
        LIMIT 10
    `).all() as any[];

    // Helper for formatting currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    // Helper for formatting date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <main className="flex-1 p-6 md:p-10 pb-24 md:pb-10">
            {/* Header */}
            <div className="flex flex-col gap-2 mb-8 md:mb-12">
                <h2 className="text-white text-3xl md:text-4xl font-extrabold tracking-tight">Producer Dashboard</h2>
                <p className="text-slate-400 text-sm font-medium">Monitoring your track performance and sales.</p>
            </div>
            <div className="
            mb-8 md:mb-12
            flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4
            md:grid md:grid-cols-3 md:gap-6 md:overflow-visible
            no-scrollbar
            ">
                {/* Card Wrapper */}
                {[
                    {
                        label: "Total Beats",
                        value: tracksCount.count,
                        icon: Disc,
                    },
                    {
                        label: "Revenue",
                        value: revenue.total || 0,
                        icon: IndianRupee,
                    },
                    {
                        label: "Total Users",
                        value: usersCount.count,
                        icon: Users,
                    },
                ].map(({ label, value, icon: Icon }) => (
                    <div
                        key={label}
                        className="
        snap-center
        min-w-[90vw] sm:min-w-[80vw] md:min-w-0
        rounded-2xl p-6
        bg-[#121212]
        border border-white/5
        relative overflow-hidden
        transition-all duration-300
        hover:border-doz-red/30 hover:shadow-xl hover:shadow-doz-red/5
        group
      "
                    >
                        {/* Background Icon */}
                        <div className="absolute top-0 right-0 p-4 opacity-[0.06] group-hover:opacity-[0.12] transition-opacity">
                            <Icon className="h-24 w-24 text-doz-red -rotate-12" />
                        </div>

                        {/* Header */}
                        <div className="flex items-center justify-between relative z-10">
                            <p className="text-[11px] font-bold tracking-widest uppercase text-slate-400">
                                {label}
                            </p>
                            <div className="rounded-lg border border-white/10 bg-white/5 p-2">
                                <Icon className="h-5 w-5 text-doz-red" />
                            </div>
                        </div>

                        {/* Value */}
                        <div className="mt-6 flex items-baseline gap-2 relative z-10">
                            <p className="text-4xl md:text-3xl xl:text-4xl font-extrabold tracking-tight text-white">
                                {value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>


            {/* Recent Orders Section */}
            <div className="glass-card rounded-2xl overflow-hidden border border-white/5 bg-[#121212]">
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <h3 className="text-white text-lg font-bold">Recent Orders</h3>
                    <button className="text-slate-400 hover:text-white transition-colors">
                        <MoreHorizontal className="h-5 w-5" />
                    </button>
                </div>

                {/* Desktop/Tablet Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5">
                                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Order ID</th>
                                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Customer</th>
                                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {recentOrders.length > 0 ? (
                                recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-5">
                                            <span className="text-slate-300 font-mono text-xs">#{order.id}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-white font-bold text-sm">
                                                    {order.first_name} {order.last_name}
                                                </span>
                                                <span className="text-slate-500 text-[10px]">{order.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-slate-400 text-sm font-medium">
                                            {formatDate(order.created_at)}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${order.status === 'COMPLETED'
                                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                : order.status === 'PENDING'
                                                    ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                                                }`}>
                                                {order.status === 'COMPLETED' && <CheckCircle className="h-3 w-3" />}
                                                {order.status === 'PENDING' && <Clock className="h-3 w-3" />}
                                                {order.status === 'FAILED' && <AlertCircle className="h-3 w-3" />}
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-white font-bold text-sm text-right">
                                            {formatCurrency(order.total)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-slate-500 text-sm">
                                        No recent orders.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden flex flex-col divide-y divide-white/5">
                    {recentOrders.length > 0 ? (
                        recentOrders.map((order) => (
                            <div key={order.id} className="p-5 flex flex-col gap-4 hover:bg-white/[0.02] transition-colors">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col">
                                        <span className="text-slate-500 text-[10px] font-mono mb-1">#{order.id}</span>
                                        <span className="text-white font-bold text-base">
                                            {order.first_name} {order.last_name}
                                        </span>
                                        <span className="text-slate-500 text-xs">{order.email}</span>
                                    </div>
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${order.status === 'COMPLETED'
                                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                        : order.status === 'PENDING'
                                            ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-1">
                                    <span className="text-slate-400 text-xs font-medium">{formatDate(order.created_at)}</span>
                                    <span className="text-white font-bold text-base">{formatCurrency(order.total)}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-slate-500 text-sm">
                            No recent orders.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
