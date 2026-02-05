"use client"
import Link from 'next/link'
import { ArrowLeft, Mail } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'
import Logo from '../assets/LOGO.png'

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [email, setEmail] = useState('')

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (!email) {
            setError('Please enter your email address')
            return
        }

        setLoading(true)

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                body: JSON.stringify({ email }),
                headers: { 'Content-Type': 'application/json' }
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong')
            }

            setSuccess(data.message || 'If an account exists, a reset link has been sent.')
            setEmail('') // Clear email on success
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

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
                                <Mail className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-2">Forgot Password</h2>
                            <p className="text-zinc-500 text-sm font-medium">Enter your email to receive proper reset instructions</p>
                        </div>

                        {success && (
                            <div className="mb-6 rounded-lg bg-green-500/10 border border-green-500/20 p-4 text-center text-sm text-green-400 font-bold">
                                {success}
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-center text-sm text-red-400 font-bold">
                                {error}
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500" htmlFor="email">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-white transition-colors h-5 w-5" />
                                    <input
                                        className="w-full bg-[#1a1a1a] border border-white/5 focus:border-white/20 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-0 transition-all font-medium text-sm"
                                        id="email"
                                        name="email"
                                        placeholder="name@example.com"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                className="w-full bg-doz-red hover:bg-[#cc181f] text-white font-bold py-4 rounded-xl uppercase tracking-widest text-sm transition-all hover:shadow-lg hover:shadow-doz-red/20 active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Sending Link...' : 'Send Reset Link'}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    )
}
