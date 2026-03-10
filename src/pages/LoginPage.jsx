import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            if (isRegister) {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                setSuccess("Conta criada! Verifique seu email para confirmar.");
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            }
        } catch (err) {
            setError(err.message === "Invalid login credentials"
                ? "Email ou senha incorretos"
                : err.message
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-sm">
                {/* Logo + subtitle */}
                <div className="mb-10 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                        WeekFlow
                    </h1>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1.5">
                        Organize sua semana com simplicidade
                    </p>
                </div>

                {/* Card */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoFocus
                            className="w-full h-11 px-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-300 dark:placeholder:text-gray-600 outline-none focus:border-indigo-400 dark:focus:border-indigo-500/50 transition-colors"
                        />
                        <input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full h-11 px-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-300 dark:placeholder:text-gray-600 outline-none focus:border-indigo-400 dark:focus:border-indigo-500/50 transition-colors"
                        />

                        {error && (
                            <p className="text-xs text-red-500 py-1">{error}</p>
                        )}
                        {success && (
                            <p className="text-xs text-emerald-500 py-1">{success}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 mt-1 text-sm font-medium rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                isRegister ? "Criar conta" : "Entrar"
                            )}
                        </button>
                    </form>
                </div>

                <button
                    onClick={() => { setIsRegister(!isRegister); setError(null); setSuccess(null); }}
                    className="w-full text-center text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors mt-5 py-2"
                >
                    {isRegister ? "Já tem conta? Entrar" : "Criar uma conta"}
                </button>
            </div>
        </div>
    );
}
