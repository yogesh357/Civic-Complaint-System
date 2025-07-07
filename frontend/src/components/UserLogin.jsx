 
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext';
import { loginUser, registerUser } from '../services/userApi';
 

function UserLogin() {
    const { setShowUserLogin, setUser, navigate, setUserType } = useAuthContext();

    const [state, setState] = useState("login"); // 'login' or 'register'
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let data;

            if (state === "register") {
                data = await registerUser(name, email, password);
                console.log("Registered user");
            } else {
                data = await loginUser(email, password);
                console.log("Logged in user");
            }

            if (data.success) {
                setUser(data.user);
                console.log("User is ", data)
                setUserType(data.role);
                navigate('/');
                setShowUserLogin(false);
                toast.success(state === "register" ? "Registered successfully!" : "Logged in successfully!");
            } else {
                toast.error(data.message || 'Something went wrong');
            }

        } catch (error) {
            console.error(`${state} error:`, error);
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div onClick={() => setShowUserLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50'>
            <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
                <p className="text-2xl font-medium m-auto">
                    <span className="text-green-800">User</span> {state === "login" ? "Login" : "Sign Up"}
                </p>

                {state === "register" && (
                    <div className="w-full">
                        <p>Name</p>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            placeholder="Type your name"
                            className="border border-gray-200 rounded w-full p-2 mt-1 outline-green-500"
                            type="text"
                            required
                        />
                    </div>
                )}

                <div className="w-full">
                    <p>Email</p>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        placeholder="Type your email"
                        className="border border-gray-200 rounded w-full p-2 mt-1 outline-gray-600"
                        type="email"
                        required
                    />
                </div>

                <div className="w-full">
                    <p>Password</p>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        placeholder="Type your password"
                        className="border border-gray-200 rounded w-full p-2 mt-1 outline-gray-600"
                        type="password"
                        required
                    />
                </div>

                <p className="text-sm text-gray-500">
                    {state === "register" ? (
                        <>Already have an account? <span onClick={() => setState("login")} className="text-blue-500 cursor-pointer">Click here</span></>
                    ) : (
                        <>Don't have an account? <span onClick={() => setState("register")} className="text-blue-500 cursor-pointer">Click here</span></>
                    )}
                </p>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 transition-all text-white w-full py-2 rounded-md cursor-pointer disabled:opacity-50"
                >
                    {loading ? 'Please wait...' : state === "register" ? "Create Account" : "Login"}
                </button>
            </form>
        </div>
    );
}

export default UserLogin;
