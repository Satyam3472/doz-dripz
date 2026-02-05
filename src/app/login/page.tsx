"use client"
import Link from 'next/link'
import { ArrowLeft, Lock, Mail, Eye, EyeOff } from 'lucide-react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import Logo from '../assets/LOGO.png'
import { useAuthStore } from '@/stores/auth.store'


export default function LoginPage() {
    const searchParams = useSearchParams()

    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [resending, setResending] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [validationErrors, setValidationErrors] = useState({ email: '', password: '' })
    const [unverifiedEmail, setUnverifiedEmail] = useState('')

    const login = useAuthStore((state) => state.login)
    const router = useRouter()

    useEffect(() => {
        if (searchParams.get('verified') === 'true') {
            setSuccess('Email verified successfully! You can now login.')
        } else if (searchParams.get('passwordChanged') === 'true') {
            setSuccess('Password updated successfully! Please login with your new password.')
        }
    }, [searchParams])

    const handleResend = async () => {
        if (!unverifiedEmail) return
        setResending(true)
        try {
            const res = await fetch('/api/auth/resend-verification', {
                method: 'POST',
                body: JSON.stringify({ email: unverifiedEmail }),
                headers: { 'Content-Type': 'application/json' }
            })
            const data = await res.json()
            if (res.ok) {
                setSuccess('Verification email sent! Please check your inbox.')
                setError('')
            } else {
                setError(data.error || 'Failed to resend email')
            }
        } catch (err) {
            setError('Something went wrong')
        } finally {
            setResending(false)
        }
    }

    const validate = (formData: FormData) => {
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        let isValid = true
        const newErrors = { email: '', password: '' }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!email || !emailRegex.test(email)) {
            newErrors.email = 'Please enter a valid email address'
            isValid = false
        }

        // Password validation (simple length check)
        if (!password || password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
            isValid = false
        }

        setValidationErrors(newErrors)
        return isValid
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')
        setSuccess('')
        setUnverifiedEmail('')

        const formData = new FormData(e.currentTarget)

        if (!validate(formData)) {
            return
        }

        setLoading(true)
        const email = formData.get('email') as string
        const password = formData.get('password')
        const remember = formData.get('remember') === 'on'

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password, remember }),
                headers: { 'Content-Type': 'application/json' }
            })

            const data = await res.json()

            if (!res.ok) {
                if (data.code === 'EMAIL_NOT_VERIFIED') {
                    setUnverifiedEmail(email)
                    throw new Error('Please verify your email to continue.')
                }
                throw new Error(data.error || 'Something went wrong')
            }

            // Sync auth state
            login(data.user)

            // Redirect to home or dashboard
            router.push('/')
            router.refresh()
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
                    <Link href="/" className="text-sm font-semibold text-zinc-500 hover:text-white transition-colors flex items-center gap-2">
                        <ArrowLeft size={18} />
                        <span className="hidden sm:inline">Back to Home</span>
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
                            <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-2">Login</h2>
                            <p className="text-zinc-500 text-sm font-medium">Secure access to your dashboard</p>
                        </div>

                        {success && (
                            <div className="mb-6 rounded-lg bg-green-500/10 border border-green-500/20 p-3 text-center text-sm text-green-400 font-bold">
                                {success}
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-center text-sm text-red-400 font-bold flex flex-col gap-2">
                                <span>{error}</span>
                                {unverifiedEmail && (
                                    <button
                                        onClick={handleResend}
                                        disabled={resending}
                                        className="text-xs underline hover:text-red-300 disabled:opacity-50"
                                    >
                                        {resending ? 'Sending...' : 'Resend Verification Email'}
                                    </button>
                                )}
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
                                        className={`w-full bg-[#1a1a1a] border ${validationErrors.email ? 'border-red-900/50 focus:border-red-500' : 'border-white/5 focus:border-white/20'} rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-0 transition-all font-medium text-sm`}
                                        id="email"
                                        name="email"
                                        // required // Using manual validation for better UX control
                                        placeholder="name@example.com"
                                        type="text"
                                    />
                                </div>
                                {validationErrors.email && <p className="text-xs text-red-500 font-medium ml-1">{validationErrors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500" htmlFor="password">
                                        Password
                                    </label>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-white transition-colors h-5 w-5" />
                                    <input
                                        className={`w-full bg-[#1a1a1a] border ${validationErrors.password ? 'border-red-900/50 focus:border-red-500' : 'border-white/5 focus:border-white/20'} rounded-xl py-3.5 pl-12 pr-12 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-0 transition-all font-medium text-sm`}
                                        id="password"
                                        name="password"
                                        // required
                                        placeholder="••••••••"
                                        type={showPassword ? "text" : "password"}
                                    />
                                    <button
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {validationErrors.password && <p className="text-xs text-red-500 font-medium ml-1">{validationErrors.password}</p>}
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <label className="flex items-center gap-2.5 cursor-pointer group select-none">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            name="remember"
                                            className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-zinc-700 bg-[#1a1a1a] checked:border-doz-red checked:bg-doz-red transition-all"
                                        />
                                        <svg
                                            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity text-white"
                                            width="10"
                                            height="8"
                                            viewBox="0 0 10 8"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M1 4L3.5 6.5L9 1"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <span className="text-xs font-semibold text-zinc-500 group-hover:text-zinc-400 transition-colors">Remember me</span>
                                </label>
                                <Link href="/forgot-password" className="text-[11px] font-bold text-doz-red hover:text-red-400 transition-colors uppercase tracking-wider">
                                    Forgot Password?
                                </Link>
                            </div>

                            <button
                                className="w-full bg-doz-red hover:bg-[#cc181f] text-white font-bold py-4 rounded-xl uppercase tracking-widest text-sm transition-all hover:shadow-lg hover:shadow-doz-red/20 active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login Now'}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-xs text-zinc-500 font-medium">
                            Don't have an account?
                            <Link href="/register" className="text-doz-red font-bold hover:text-red-400 transition-colors ml-1">
                                Join the Drip
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8 flex justify-center gap-6">
                        <Link href="#" className="text-[10px] font-bold text-zinc-600 hover:text-zinc-400 uppercase tracking-widest transition-colors">Privacy</Link>
                        <Link href="#" className="text-[10px] font-bold text-zinc-600 hover:text-zinc-400 uppercase tracking-widest transition-colors">Terms</Link>
                        <Link href="#" className="text-[10px] font-bold text-zinc-600 hover:text-zinc-400 uppercase tracking-widest transition-colors">Support</Link>
                    </div>
                </div>
            </main>
        </div>
    )
}
