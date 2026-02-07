
'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Tag, Check, X, Loader2 } from 'lucide-react';

interface Coupon {
    id: number;
    code: string;
    discountPercent: number;
    isActive: number;
    expiresAt: string;
    createdAt: string;
}

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        code: '',
        discountPercent: '',
        expiresAt: '',
        isActive: true
    });

    const fetchCoupons = async () => {
        try {
            const res = await fetch('/api/admin/coupons');
            const data = await res.json();
            if (Array.isArray(data)) setCoupons(data);
        } catch (error) {
            console.error('Failed to fetch coupons:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = editingCoupon
                ? `/api/admin/coupons/${editingCoupon.id}`
                : '/api/admin/coupons';

            const method = editingCoupon ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: formData.code,
                    discountPercent: Number(formData.discountPercent),
                    expiresAt: formData.expiresAt,
                    isActive: formData.isActive
                })
            });

            if (res.ok) {
                fetchCoupons();
                setIsModalOpen(false);
                resetForm();
            } else {
                alert('Failed to save coupon');
            }
        } catch (error) {
            console.error('Error saving coupon:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this coupon?')) return;

        try {
            const res = await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setCoupons(coupons.filter(c => c.id !== id));
            } else {
                alert('Failed to delete coupon');
            }
        } catch (error) {
            console.error('Error deleting coupon:', error);
        }
    };

    const openEditModal = (coupon: Coupon) => {
        setEditingCoupon(coupon);
        setFormData({
            code: coupon.code,
            discountPercent: coupon.discountPercent.toString(),
            expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : '',
            isActive: Boolean(coupon.isActive)
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setEditingCoupon(null);
        setFormData({ code: '', discountPercent: '', expiresAt: '', isActive: true });
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Coupons</h1>
                    <p className="text-white/50">Manage discount codes and promotions</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="bg-doz-red hover:bg-doz-red/90 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors uppercase tracking-wider text-sm"
                >
                    <Plus size={18} />
                    Add Coupon
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center p-10"><Loader2 className="animate-spin text-white/20" /></div>
            ) : (
                <div className="bg-[#121212] border border-white/5 rounded-xl overflow-hidden">
                    {/* Desktop View */}
                    <table className="w-full text-left text-sm text-white/70 hidden md:table">
                        <thead className="bg-white/5 text-white/50 uppercase text-xs font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Code</th>
                                <th className="px-6 py-4">Discount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Expires</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {coupons.map((coupon) => (
                                <tr key={coupon.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-bold text-white max-w-[200px] truncate">
                                        <div className="flex items-center gap-2">
                                            <Tag size={14} className="text-white/30" />
                                            {coupon.code}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-doz-red font-bold">
                                        {coupon.discountPercent}%
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${coupon.isActive ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/40'}`}>
                                            {coupon.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs">
                                        {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => openEditModal(coupon)}
                                            className="text-white/40 hover:text-white transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(coupon.id)}
                                            className="text-white/40 hover:text-doz-red transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Mobile View */}
                    <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
                        {coupons.map((coupon) => (
                            <div key={coupon.id} className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <Tag size={16} className="text-doz-red" />
                                        <span className="font-black text-white text-lg tracking-wide uppercase">{coupon.code}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => openEditModal(coupon)} className="p-2 bg-white/5 rounded text-white/70 hover:text-white">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(coupon.id)} className="p-2 bg-white/5 rounded text-white/70 hover:text-doz-red">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="bg-black/40 p-2 rounded">
                                        <span className="block text-white/30 uppercase text-[10px] font-bold">Discount</span>
                                        <span className="font-bold text-doz-red">{coupon.discountPercent}% Off</span>
                                    </div>
                                    <div className="bg-black/40 p-2 rounded">
                                        <span className="block text-white/30 uppercase text-[10px] font-bold">Status</span>
                                        <span className={`${coupon.isActive ? 'text-green-400' : 'text-white/40'} font-bold`}>
                                            {coupon.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-[10px] text-white/30 text-center uppercase tracking-widest pt-1">
                                    Expires: {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : 'Never'}
                                </div>
                            </div>
                        ))}
                    </div>

                    {coupons.length === 0 && (
                        <div className="p-10 text-center text-white/30">
                            No coupons found. Create one to get started.
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#121212] border border-white/10 rounded-xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <h2 className="text-xl font-bold text-white">
                                {editingCoupon ? 'Edit Coupon' : 'New Coupon'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-white/30 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-white/50 uppercase mb-1">Coupon Code</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.code}
                                    onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-doz-red outline-none font-mono tracking-wider uppercase"
                                    placeholder="e.g. SUMMER20"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-white/50 uppercase mb-1">Discount Percentage</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        max="100"
                                        value={formData.discountPercent}
                                        onChange={e => setFormData({ ...formData, discountPercent: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-doz-red outline-none pl-3"
                                        placeholder="20"
                                    />
                                    <span className="absolute right-4 top-3 text-white/30">%</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-white/50 uppercase mb-1">Expiration Date</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.expiresAt}
                                    onChange={e => setFormData({ ...formData, expiresAt: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white warning-calendar-dark focus:border-doz-red outline-none"
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="h-4 w-4 bg-white/5 border-white/10 rounded text-doz-red focus:ring-doz-red"
                                />
                                <label htmlFor="isActive" className="text-sm font-medium text-white/80 select-none">
                                    Active Status
                                </label>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-3 rounded-lg font-bold text-white/50 hover:bg-white/5"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-doz-red hover:bg-doz-red/90 text-white px-4 py-3 rounded-lg font-bold"
                                >
                                    Save Coupon
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
