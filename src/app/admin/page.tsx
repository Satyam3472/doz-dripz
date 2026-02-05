import db from "@/app/lib/db";

export default function AdminDashboardPage() {
    // Quick Stats Fetching
    const tracksCount = db.prepare("SELECT COUNT(*) as count FROM tracks").get() as { count: number };
    const ordersCount = db.prepare("SELECT COUNT(*) as count FROM orders").get() as { count: number }; // Assuming orders table exists/populated
    const revenue = db.prepare("SELECT SUM(total) as total FROM orders WHERE status = 'COMPLETED'").get() as { total: number };

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stat Card 1 */}
                <div className="bg-[#121212] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        {/* Icon placeholder */}
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-white/40 text-sm font-bold uppercase tracking-widest mb-1">Total Tracks</h3>
                        <p className="text-4xl font-black text-white">{tracksCount.count}</p>
                    </div>
                </div>

                {/* Stat Card 2 */}
                <div className="bg-[#121212] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="relative z-10">
                        <h3 className="text-white/40 text-sm font-bold uppercase tracking-widest mb-1">Total Sales</h3>
                        <p className="text-4xl font-black text-white">{ordersCount.count}</p>
                    </div>
                </div>

                {/* Stat Card 3 */}
                <div className="bg-[#121212] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="relative z-10">
                        <h3 className="text-white/40 text-sm font-bold uppercase tracking-widest mb-1">Revenue</h3>
                        <p className="text-4xl font-black text-[#E11D48]">${(revenue.total || 0).toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {/* Recent Activity / Quick Actions could go here */}
        </div>
    );
}
