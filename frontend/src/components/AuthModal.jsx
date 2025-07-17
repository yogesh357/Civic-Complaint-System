import React, { useState } from 'react'; 
import { useAuthContext } from '../context/AuthContext';
import { loginUser, registerUser } from '../services/userApi';
import { adminLogin, adminRegister } from '../services/adminApi';
import { toast } from 'react-toastify';

function AuthModal() {
    const {
        setShowAuthModal,
        authModalType,
        setAuthModalType,
        setUser,
        navigate,
        setUserType,
        showAuthModal,
        user,
        userType
    } = useAuthContext();

    const [formState, setFormState] = useState('login'); // 'login' or 'register'
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);


    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let response;

            if (authModalType === 'user') {
                if (formState === 'login') {
                    response = await loginUser(email, password);
                } else {
                    response = await registerUser(name, email, password);
                }
            } else if(authModalType == 'admin') { // admin
                if (formState === 'login') {
                    response = await adminLogin(email, password);
                } else {

                    response = await adminRegister(name, email, password);
                }
            }

            const responseData = response.data || response;
            console.log("respone data from auth model", responseData)

            if (responseData.success) {
                console.log("logged in ..")
                const userInfo = responseData.user || responseData.data; // works for both user and admin
                setUser(userInfo); 
                console.log("user from auth modal ", user) 
                const role = userInfo.role?.toUpperCase(); // "USER" or "ADMIN"
                setUserType(role);

                navigate(authModalType.toUpperCase() === 'USER' ? '/' : '/department');
                setShowAuthModal(false);
                toast.success(
                    `${authModalType} ${formState === 'login' ? 'logged in' : 'registered'} successfully`
                );
            } else {
                toast.error(responseData.message || 'Authentication failed');
            }
        } catch (error) {
            console.error('Auth error:', error);
            toast.error(error.response?.data?.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    }; 

    if (!showAuthModal) return null;

    return (
        <div
            onClick={() => setShowAuthModal(false)}
            className='fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50'
        >
            <form
                onSubmit={handleAuthSubmit}
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
            >
                {/* Auth Type Toggle */}
                <div className="flex w-full justify-center gap-4 mb-2">
                    <button
                        type="button"
                        onClick={() => setAuthModalType('user')}
                        className={`px-4 py-1 rounded-md ${authModalType === 'user' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                    >
                        User
                    </button>
                    <button
                        type="button"
                        onClick={() => setAuthModalType('admin')}
                        className={`px-4 py-1 rounded-md ${authModalType === 'admin' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                    >
                        Admin
                    </button>
                </div>

                <p className="text-2xl font-medium m-auto">
                    <span className="text-green-800">
                        {authModalType === 'user' ? 'User' : 'Municipality'}
                    </span> {formState === 'login' ? 'Login' : 'Sign Up'}
                </p>

                {formState === 'register' && (
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
                    {formState === 'register' ? (
                        <>Already have an account? <span
                            onClick={() => setFormState('login')}
                            className="text-blue-500 cursor-pointer"
                        >Click here</span></>
                    ) : (
                        <>Don't have an account? <span
                            onClick={() => setFormState('register')}
                            className="text-blue-500 cursor-pointer"
                        >Click here</span></>
                    )}
                </p>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 transition-all text-white w-full py-2 rounded-md cursor-pointer disabled:opacity-50"
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </span>
                    ) : formState === 'register'
                        ? 'Create Account'
                        : 'Login'}
                </button>
            </form>
        </div>
    );
}

export default AuthModal;