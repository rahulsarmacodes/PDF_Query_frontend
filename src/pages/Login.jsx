import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import GoogleIcon from '../assets/GoogleIcon';

const API_BASE = import.meta.env.VITE_API_URL;

const Login = () => {
    // local states for form handling
    const [state, setState] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // context and navigation hooks
    const { setUser, theme, setTheme, createNewChat } = useAppContext();
    const navigate = useNavigate();

    //testing 
    console.log("API URL:", import.meta.env.VITE_API_URL);
    // handle form submit for both login and register
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (state === "login") {
                
                //login section
                const formData = new URLSearchParams();
                formData.append("username", email); // FastAPI expects username for OAuth2
                formData.append("password", password);

                const response = await fetch(`${API_BASE}/auth/token`, {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: formData.toString(),
                });

                if (!response.ok) throw new Error("Invalid email or password");

                const data = await response.json();
                localStorage.setItem("token", data.access_token);
                localStorage.setItem("user", JSON.stringify(data.user));

                setUser(data.user);

                // navigate or create chat
                if (typeof createNewChat === 'function') createNewChat();
                navigate("/");

            } else {
                
                // signup section
                const response = await fetch(`${API_BASE}/auth/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email,username: email, password }),
                });

                if (!response.ok) throw new Error("Registration failed");

                alert("Account created successfully! Please login now.");
                setState("login"); // switch to login form
            }
        } catch (error) {
            alert(error.message);
            console.error("Error:", error);
        }
    };

    return (
        <div
            className={` min-h-screen w-full transition-colors duration-300 flex flex-col items-center justify-center
                ${theme === 'dark'
                    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700'
                    : 'bg-gradient-to-br from-slate-400 via-slate-200 to-slate-700 animate-gradient-x'}
            `}
        >
            {/* Mode toggle button */}
            <button
                className={`absolute top-4 right-4 px-4 py-2 rounded-full font-semibold shadow-md transition-colors duration-200
                    ${theme === 'dark' ? 'bg-white text-gray-900 hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-gray-700'}`}
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>

            {/* Main form container */}
            <div className="flex-1 flex items-center justify-center w-full px-1 md:px-0">
                <form
                    onSubmit={handleSubmit}
                    className={`flex flex-col gap-5 md:gap-6 items-center justify-center w-full max-w-lg mx-auto p-4 sm:p-8 md:p-10 my-8 rounded-3xl shadow-2xl border-4 animate-fade-in transition-colors duration-300
                        ${theme === 'dark'
                            ? 'bg-gray-900/95 border-gray-700 text-white'
                            : 'bg-white/95 border-gray-700 text-gray-900'}
                    `}
                >
                    {/* form heading */}
                    <h1 className={`text-3xl md:text-4xl font-extrabold text-center  mb-2 
                        ${theme === 'dark'
                            ? 'text-transparent bg-clip-text bg-white'
                            : 'text-transparent bg-clip-text bg-slate-700'}
                    `}>
                        Welcome!
                    </h1>

                    <p className={`text-base md:text-lg mb-4 text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Sign in to your account or create a new one below.
                    </p>

                    {/* Google signup button */}
                    <button
                        type="button"
                        className={`flex items-center gap-3 w-full justify-center py-3 px-4 md:px-6 rounded-lg border-2 transition-all shadow-md mb-2 font-semibold text-base
                            ${theme === 'dark'
                                ? 'border-gray-600 bg-gray-800 text-white hover:bg-gray-700'
                                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'}
                        `}
                    >
                        <GoogleIcon style={{ width: 24, height: 24 }} />
                        Sign up with Google
                    </button>

                    {/* divider */}
                    <div className="w-full flex items-center gap-2 my-2 text-xs md:text-sm">
                        <div className={`flex-1 h-px ${theme === 'dark' ? 'bg-gradient-to-r from-gray-700 to-gray-800' : 'bg-gradient-to-r from-gray-300 to-gray-100'}`} />
                        <span className={`text-xs font-bold ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>OR</span>
                        <div className={`flex-1 h-px ${theme === 'dark' ? 'bg-gradient-to-l from-gray-700 to-gray-800' : 'bg-gradient-to-l from-gray-300 to-gray-100'}`} />
                    </div>

                    {/* show name field only in register mode */}
                    {state === "register" && (
                        <div className="w-full flex flex-col items-center">
                            <p className={`self-start font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Name</p>
                            <input onChange={(e) => setName(e.target.value)} value={name} placeholder="Type your name" className={`border-2 rounded-lg w-full p-2 md:p-3 mt-1 outline-none transition-colors duration-200
                                ${theme === 'dark' ? 'border-gray-600 bg-gray-800 text-white focus:border-pink-400' : 'border-gray-400 bg-white/80 text-gray-900 focus:border-pink-500'}`}
                                type="text" required />
                        </div>
                    )}

                    {/* email field */}
                    <div className="w-full flex flex-col items-center">
                        <p className={`self-start font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Email</p>
                        <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Type your email" className={`border-2 rounded-lg w-full p-2 md:p-3 mt-1 outline-none transition-colors duration-200
                            ${theme === 'dark' ? 'border-gray-600 bg-gray-800 text-white focus:border-indigo-300' : 'border-gray-400 bg-white/80 text-gray-900 focus:border-indigo-500'}`}
                            type="email" required />
                    </div>

                    {/* password field */}
                    <div className="w-full flex flex-col items-center">
                        <p className={`self-start font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Password</p>
                        <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Type your password" className={`border-2 rounded-lg w-full p-2 md:p-3 mt-1 outline-none transition-colors duration-200
                            ${theme === 'dark' ? 'border-gray-600 bg-gray-800 text-white focus:border-purple-300' : 'border-gray-400 bg-white/80 text-gray-900 focus:border-purple-500'}`}
                            type="password" required />
                    </div>

                    {/* toggle between login/register */}
                    {state === "register" ? (
                        <p className={`text-center w-full text-sm ${theme === 'dark' ? 'text-gray-400' : ''}`}>
                            Already have an account? <span onClick={() => setState("login")} className="text-indigo-400 font-bold cursor-pointer hover:underline">Click here</span>
                        </p>
                    ) : (
                        <p className={`text-center w-full text-sm ${theme === 'dark' ? 'text-gray-400' : ''}`}>
                            Create an account? <span onClick={() => setState("register")} className="text-pink-400 font-bold cursor-pointer hover:underline">Click here</span>
                        </p>
                    )}

                    {/* submit button */}
                    <button type='submit' className={`w-full py-2 md:py-3 rounded-lg font-bold text-base md:text-lg shadow-lg mt-2 transition-all
                        ${theme === 'dark'
                            ? 'bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white'
                            : 'bg-gradient-to-r from-indigo-500 via-pink-500 to-purple-500 hover:from-pink-500 hover:to-indigo-500 text-white'}
                    `}>
                        {state === "register" ? "Create Account" : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
