"use client";

import { useState } from "react";
import { ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

export default function ContactSection() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
        phonenumber: ""
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus("idle");
        setErrorMessage("");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            setStatus("success");
            setFormData({ name: "", email: "", message: "", phonenumber: "" }); // Reset form
        } catch (error: any) {
            setStatus("error");
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-black py-24 text-white">
            <div className="mx-auto max-w-[600px] px-6">
                <div className="mb-12 text-center">
                    <h2 className="text-4xl font-black uppercase tracking-tighter">
                        Get In Touch
                    </h2>
                    <p className="mt-2 text-sm text-white/50">
                        Ready to take your sound to the next level?
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {status === "success" && (
                        <div className="flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/20 p-4 text-green-500 text-sm font-bold">
                            <CheckCircle2 className="h-5 w-5" />
                            Message sent successfully! We'll get back to you soon.
                        </div>
                    )}
                    {status === "error" && (
                        <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-red-500 text-sm font-bold">
                            <AlertCircle className="h-5 w-5" />
                            {errorMessage}
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-white/10 bg-[#121212] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none focus:ring-0"
                            placeholder="NAME"
                            type="text"
                            required
                        />
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-white/10 bg-[#121212] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none focus:ring-0"
                            placeholder="EMAIL"
                            type="email"
                            required
                        />
                    </div>
                    {/* User requested Phone Number field in plan but not in original UI. 
                        I will add it to matching design if needed, or stick to constraints.
                        The request said "The form contains: name, email, message, phonenumber". 
                        The original code only had 2 inputs (Name, Email). 
                        I will add Phone Number input to match requirements, keeping style consistent. 
                    */}
                    <input
                        name="phonenumber"
                        value={formData.phonenumber}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-white/10 bg-[#121212] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none focus:ring-0"
                        placeholder="PHONE NUMBER (Optional)"
                        type="tel"
                    />

                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-white/10 bg-[#121212] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none focus:ring-0"
                        placeholder="MESSAGE"
                        rows={6}
                        required
                        minLength={10}
                    />
                    <button
                        disabled={loading || status === 'success'}
                        className="flex items-center justify-center gap-2 rounded-lg bg-white py-3 text-sm font-black uppercase tracking-wider text-black transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                            </>
                        ) : (
                            <>
                                Send Message <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </section>
    )
}
