import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const API_BASE_URL = import.meta.env.VITE_API_URL;
//const API_BASE_URL = "http://localhost:8000";

const Login = () => {
    const [state, setState] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { setUser, theme, setTheme, createNewChat } = useAppContext();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (state === "login") {
                const formData = new URLSearchParams();
                formData.append("username", email);
                formData.append("password", password);

                const response = await fetch(`${API_BASE_URL}/auth/token`, {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: formData.toString(),
                });

                if (!response.ok) throw new Error("Invalid email or password");

                const data = await response.json();
                localStorage.setItem("token", data.access_token);
                localStorage.setItem("user", JSON.stringify(data.user));

                setUser(data.user);

                if (typeof createNewChat === 'function') createNewChat();
                navigate("/");

            } else {
                
                const response = await fetch(`${API_BASE_URL}/auth/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password }),
                });

                if (!response.ok) throw new Error("Registration failed");

                alert("Account created successfully! Please login now.");
                setState("login");
            }
        } catch (error) {
            alert(error.message);
            console.error("Error:", error);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row justify-center items-stretch min-h-screen w-full bg-[#e4e2e2] dark:bg-linear-to-b dark:from-[#242124] dark:to-[#000000] text-white font-lato">
            
            {/* LOGIN SECTION (Top priority on mobile) */}
            <div className="w-full lg:w-1/2 relative flex flex-col items-center justify-center order-1 p-6 lg:p-12 lg:pr-12 lg:shadow-2xl flex-1 min-h-[60vh] lg:min-h-screen bg-transparent">

                {/* Dark/Light Mode Toggle */}
                <button
                    className={`fixed top-4 right-4 z-50 px-3 py-2 text-xs lg:text-sm font-semibold rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 backdrop-blur-md border
                        ${theme === 'dark'
                            ? 'bg-[#27E0B3]/90 text-black border-[#27E0B3]/50 hover:bg-[#16a883]/90'
                            : 'bg-white/90 text-[#16a883] border-[#16a883]/30 hover:bg-[#16a883]/10'
                        }`}
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>

                {/* Logo for mobile */}
                <img 
                    src={theme === "dark" ? assets.PaperMind_logo_white : assets.PaperMind_logo}
                    alt="PaperMind Logo"
                    className="w-28 lg:hidden mb-6 mx-auto"
                />

                {/* Authentication Form */}
                <div className="w-full max-w-md space-y-6 flex flex-col justify-center">
                    <div className="text-center mb-8">
                        <h2 className={`text-2xl lg:text-3xl font-bold tracking-tight mb-2
                            ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                            Welcome Back!
                        </h2>
                        <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'} text-sm lg:text-base font-medium`}>
                            Sign in to continue your journey
                        </span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {state === "register" && (
                            <div>
                                <p className={`font-semibold mb-2 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                                    Name
                                </p>
                                <input 
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                    placeholder="Enter your full name"
                                    className={`w-full p-4 rounded-full outline-none text-sm border backdrop-blur-md
                                        ${theme === 'dark'
                                            ? 'bg-[#1e1e1e]/60 border-gray-600 text-white placeholder-gray-400 focus:border-[#27E0B3]'
                                            : 'bg-white/80 border-gray-300 text-slate-700 placeholder-gray-500 focus:border-[#16a883]'
                                        }`}
                                    type="text"
                                    required
                                />
                            </div>
                        )}

                        <div>
                            <p className={`font-semibold mb-2 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                                Email
                            </p>
                            <input 
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                placeholder="Enter your email"
                                className={`w-full p-4 rounded-full outline-none text-sm border backdrop-blur-md
                                    ${theme === 'dark'
                                        ? 'bg-[#1e1e1e]/60 border-gray-600 text-white placeholder-gray-400 focus:border-[#27E0B3]'
                                        : 'bg-white/80 border-gray-300 text-slate-700 placeholder-gray-500 focus:border-[#16a883]'
                                    }`}
                                type="email"
                                required
                            />
                        </div>

                        <div>
                            <p className={`font-semibold mb-2 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                                Password
                            </p>
                            <input 
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                placeholder="Enter your password"
                                className={`w-full p-4 rounded-full outline-none text-sm border backdrop-blur-md
                                    ${theme === 'dark'
                                        ? 'bg-[#1e1e1e]/60 border-gray-600 text-white placeholder-gray-400 focus:border-[#27E0B3]'
                                        : 'bg-white/80 border-gray-300 text-slate-700 placeholder-gray-500 focus:border-[#16a883]'
                                    }`}
                                type="password"
                                required
                            />
                        </div>

                        <p className={`text-center text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                            {state === "register" ? (
                                <>
                                    Already have an account?
                                    <span 
                                        onClick={() => setState("login")}
                                        className={`font-bold cursor-pointer hover:underline ${
                                            theme === 'dark' ? 'text-[#27E0B3]' : 'text-[#16a883]'
                                        }`}
                                    >
                                        {" "}Sign in
                                    </span>
                                </>
                            ) : (
                                <>
                                    Need an account?
                                    <span 
                                        onClick={() => setState("register")}
                                        className={`font-bold cursor-pointer hover:underline ${
                                            theme === 'dark' ? 'text-[#27E0B3]' : 'text-[#16a883]'
                                        }`}
                                    >
                                        {" "}Register
                                    </span>
                                </>
                            )}
                        </p>

                        <button 
                            type="submit" 
                            className={`w-full p-4 rounded-full font-bold text-sm shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 border backdrop-blur-md
                                ${theme === 'dark'
                                    ? 'bg-[#27E0B3] hover:bg-[#16a883] text-white border-[#27E0B3]/50'
                                    : 'bg-[#16a883] hover:bg-[#27E0B3] text-white border-[#16a883]/50'
                                }`}
                        >
                            {state === "register" ? "Create Account" : "Sign In"}
                        </button>
                    </form>
                </div>
            </div>

            {/* PRODUCT EXPLANATION SECTION */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center text-center lg:text-left lg:pl-12 order-2 p-6 lg:p-12 lg:pr-6 rounded-3xl backdrop-blur-md flex-1 min-h-[40vh] lg:min-h-screen overflow-y-auto border-t lg:border-t-0 lg:border-l border-gray-300 dark:border-gray-700">
                
                {/* Logo for desktop */}
                <img 
                    src={theme === "dark" ? assets.PaperMind_logo_white : assets.PaperMind_logo}
                    alt="PaperMind Logo"
                    className="hidden lg:block w-24 lg:w-36 mb-6 mx-auto lg:mx-0"
                />

                {/* Product Headings */}
                <div className="space-y-4 lg:space-y-6 max-w-lg mx-auto lg:mx-0">
                    <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-lato
                        ${theme === 'dark'
                            ? 'text-slate-200 bg-clip-text bg-gradient-to-r from-[#27E0B3] to-[#16a883]'
                            : 'text-slate-700'
                        }`}>
                        Your PDFs, now interactive!
                    </h1>

                    <span className={`text-xl sm:text-2xl lg:text-3xl font-bold bg-clip-text text-transparent block font-lato
                        ${theme === 'dark'
                            ? 'bg-gradient-to-r from-[#27E0B3] to-[#16a883]'
                            : 'bg-gradient-to-r from-[#149c7a] to-[#16a883]'
                        }`}>
                        Chat, learn, and explore
                    </span>

                    <p className={`text-base lg:text-lg font-doto font-medium mt-4
                        ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                        Transform your documents into conversational experiences.
                        Ask questions, get insights, and unlock knowledge instantly.
                    </p>
                </div>

                {/* Feature Cards */}
                <div className="mt-8 lg:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0 w-full">

                    <div className={`p-4 rounded-2xl backdrop-blur-md border text-left
                        ${theme === 'dark'
                            ? 'bg-[#1e1e1e]/40 border-[#27E0B3]/30'
                            : 'bg-white/70 border-[#16a883]/30'
                        }`}>
                        <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center
                            ${theme === 'dark'
                                ? 'bg-[#27E0B3]/20'
                                : 'bg-[#16a883]/20'
                            }`}>
                            <span className="text-xl">📄</span>
                        </div>
                        <h3 className={`font-bold text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                            Upload PDFs
                        </h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                            Securely upload your documents
                        </p>
                    </div>

                    <div className={`p-4 rounded-2xl backdrop-blur-md border text-left
                        ${theme === 'dark'
                            ? 'bg-[#1e1e1e]/40 border-[#27E0B3]/30'
                            : 'bg-white/70 border-[#16a883]/30'
                        }`}>
                        <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center
                            ${theme === 'dark'
                                ? 'bg-[#27E0B3]/20'
                                : 'bg-[#16a883]/20'
                            }`}>
                            <span className="text-xl">💬</span>
                        </div>
                        <h3 className={`font-bold text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                            Smart Chat
                        </h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                            Ask questions & get instant answers
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;
