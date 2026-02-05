"use client"
import Link from 'next/link'
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { useState, Suspense } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import Logo from '../assets/LOGO.png'

function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const router = useRouter()

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')

        if (!token) {
            setError('Invalid or missing token')
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setLoading(true)

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                body: JSON.stringify({ token, newPassword: password }),
                headers: { 'Content-Type': 'application/json' }
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong')
            }

            setSuccess(true)
            // Redirect after delay
            setTimeout(() => {
                router.push('/login?passwordChanged=true')
            }, 2000)

        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (!token) {
        return (
            <div className="text-center">
                <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-center text-sm text-red-400 font-bold">
                    Invalid Reset Link. Please request a new one.
                </div>
                <Link href="/forgot-password" className="text-doz-red font-bold hover:text-red-400 transition-colors uppercase tracking-wider text-xs">
                    Request New Link
                </Link>
            </div>
        )
    }

    if (success) {
        return (
            <div className="text-center py-10">
                <div className="h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                    <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-black uppercase text-white mb-2">Password Reset!</h3>
                <p className="text-zinc-500 text-sm mb-6">Redirecting to login...</p>
            </div>
        )
    }

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
                <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-center text-sm text-red-400 font-bold">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500" htmlFor="password">
                    New Password
                </label>
                <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-white transition-colors h-5 w-5" />
                    <input
                        className="w-full bg-[#1a1a1a] border border-white/5 focus:border-white/20 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-0 transition-all font-medium text-sm"
                        id="password"
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500" htmlFor="confirmPassword">
                    Confirm Password
                </label>
                <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-white transition-colors h-5 w-5" />
                    <input
                        className="w-full bg-[#1a1a1a] border border-white/5 focus:border-white/20 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-0 transition-all font-medium text-sm"
                        id="confirmPassword"
                        placeholder="••••••••"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
            </div>

            <button
                className="w-full bg-doz-red hover:bg-[#cc181f] text-white font-bold py-4 rounded-xl uppercase tracking-widest text-sm transition-all hover:shadow-lg hover:shadow-doz-red/20 active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
            >
                {loading ? 'Resetting...' : 'Set New Password'}
            </button>
        </form>
    )
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex flex-col bg-[#0a0a0a] font-display text-white selection:bg-doz-red/30 relative overflow-hidden">

            {/* Subtle Ambient Background */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-doz-red/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-doz-red/5 rounded-full blur-[100px]" />
            </div>

            <nav className="w-full px-6 py-6 sm:py-8 absolute top-0 z-50">
                <div className="mx-auto flex max-w-[1200px] items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative h-10 w-10 overflow-hidden rounded-xl transition-transform group-hover:scale-105">
                            <Image
                                src={Logo}
                                alt="Doz Dripz Logo"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        <h1 className="text-xl font-black tracking-tight text-white">
                            DOZ <span className="text-doz-red">DRIPZ</span>
                        </h1>
                    </Link>
                    <Link href="/login" className="text-sm font-semibold text-zinc-500 hover:text-white transition-colors flex items-center gap-2">
                        <ArrowLeft size={18} />
                        <span className="hidden sm:inline">Back to Login</span>
                    </Link>
                </div>
            </nav>

            <main className="flex-1 flex items-center justify-center p-4 pt-24 relative z-10">
                <div className="w-full max-w-[420px]">
                    <div className="bg-[#121212] border border-white/5 shadow-2xl relative z-10 p-8 md:p-10 rounded-3xl">

                        <div className="mb-8 text-center flex flex-col items-center">
                            <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-[#1a1a1a] mb-6 text-doz-red shadow-inner">
                                <Lock className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-2">New Password</h2>
                            <p className="text-zinc-500 text-sm font-medium">Create a strong password for your account</p>
                        </div>

                        <Suspense fallback={<div className="text-center text-zinc-500">Loading...</div>}>
                            <ResetPasswordForm />
                        </Suspense>
                    </div>
                </div>
            </main>
        </div>
    )
}
