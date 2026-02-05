"use client"
import Link from 'next/link'
import { ArrowLeft, Lock, Mail, Eye, EyeOff, User, Phone } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Logo from '../assets/LOGO.png'

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [validationErrors, setValidationErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: ''
    })

    const router = useRouter()

    const validate = (formData: FormData) => {
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const firstName = formData.get('firstName') as string
        const lastName = formData.get('lastName') as string
        const phone = formData.get('phone') as string

        let isValid = true
        const newErrors = { firstName: '', lastName: '', email: '', password: '', phone: '' }

        if (!firstName.trim()) {
            newErrors.firstName = 'First name is required'
            isValid = false
        }

        if (!lastName.trim()) {
            newErrors.lastName = 'Last name is required'
            isValid = false
        }

        if (!phone.trim() || phone.length !== 10) {
            newErrors.phone = 'Please enter valid 10 digit phone number'
            isValid = false
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!email || !emailRegex.test(email)) {
            newErrors.email = 'Please enter a valid email address'
            isValid = false
        }

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

        const formData = new FormData(e.currentTarget)

        if (!validate(formData)) {
            return
        }

        setLoading(true)
        const data = Object.fromEntries(formData)

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            })

            const resData = await res.json()

            if (!res.ok) {
                throw new Error(resData.error || 'Something went wrong')
            }

            // Redirect to login on success
            router.push('/login')
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
                <div className="w-full max-w-[520px]">
                    <div className="bg-[#121212] border border-white/5 shadow-2xl relative z-10 p-8 md:p-10 rounded-3xl">

                        <div className="mb-8 text-center flex flex-col items-center">
                            <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-[#1a1a1a] mb-6 text-doz-red shadow-inner">
                                <User className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-2">Join the Drip</h2>
                            <p className="text-zinc-500 text-sm font-medium">Create your account to start purchasing</p>
                        </div>

                        {error && (
                            <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-center text-sm text-red-400 font-bold">
                                {error}
                            </div>
                        )}

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500" htmlFor="firstName">First Name</label>
                                    <input
                                        className={`w-full bg-[#1a1a1a] border ${validationErrors.firstName ? 'border-red-900/50 focus:border-red-500' : 'border-white/5 focus:border-white/20'} rounded-xl py-3 px-4 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-0 transition-all font-medium text-sm`}
                                        id="firstName"
                                        name="firstName"
                                        placeholder="John"
                                        type="text"
                                    />
                                    {validationErrors.firstName && <p className="text-xs text-red-500 font-medium ml-1">{validationErrors.firstName}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500" htmlFor="lastName">Last Name</label>
                                    <input
                                        className={`w-full bg-[#1a1a1a] border ${validationErrors.lastName ? 'border-red-900/50 focus:border-red-500' : 'border-white/5 focus:border-white/20'} rounded-xl py-3 px-4 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-0 transition-all font-medium text-sm`}
                                        id="lastName"
                                        name="lastName"
                                        placeholder="Doe"
                                        type="text"
                                    />
                                    {validationErrors.lastName && <p className="text-xs text-red-500 font-medium ml-1">{validationErrors.lastName}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500" htmlFor="phone">Phone Number</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-white transition-colors h-5 w-5" />
                                    <input
                                        className="w-full bg-[#1a1a1a] border border-white/5 focus:border-white/20 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-0 transition-all font-medium text-sm"
                                        id="phone"
                                        name="phone"
                                        placeholder="9876543210"
                                        type="tel"
                                    />
                                    {validationErrors.phone && <p className="text-xs text-red-500 font-medium ml-1">{validationErrors.phone}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500" htmlFor="email">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-white transition-colors h-5 w-5" />
                                    <input
                                        className={`w-full bg-[#1a1a1a] border ${validationErrors.email ? 'border-red-900/50 focus:border-red-500' : 'border-white/5 focus:border-white/20'} rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-0 transition-all font-medium text-sm`}
                                        id="email"
                                        name="email"
                                        placeholder="name@example.com"
                                        type="text"
                                    />
                                </div>
                                {validationErrors.email && <p className="text-xs text-red-500 font-medium ml-1">{validationErrors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500" htmlFor="password">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-white transition-colors h-5 w-5" />
                                    <input
                                        className={`w-full bg-[#1a1a1a] border ${validationErrors.password ? 'border-red-900/50 focus:border-red-500' : 'border-white/5 focus:border-white/20'} rounded-xl py-3.5 pl-12 pr-12 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-0 transition-all font-medium text-sm`}
                                        id="password"
                                        name="password"
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

                            <button
                                className="w-full bg-doz-red hover:bg-[#cc181f] text-white font-bold py-4 rounded-xl uppercase tracking-widest text-sm transition-all hover:shadow-lg hover:shadow-doz-red/20 active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Register Now'}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-xs text-zinc-500 font-medium">
                            Already have an account?
                            <Link href="/login" className="text-doz-red font-bold hover:text-red-400 transition-colors ml-1">
                                Sign In
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
