import { useState } from 'react';

export default function LoginScreen() {
  const [activeTab, setActiveTab] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Login pressed with:', { email, password });
    alert('Login clicked! Check console for details.');
  };

  const handleResetPassword = () => {
    console.log('Reset password pressed');
    alert('Reset password clicked!');
  };

  const handleSignUp = () => {
    console.log('Sign up pressed');
    alert('Sign up clicked!');
  };

  const handleKeyPress = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Phone Frame */}
        <div className="bg-black rounded-[3rem] p-3 shadow-2xl">
          <div className="bg-white rounded-[2.5rem] overflow-hidden">
            {/* Notch */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-black rounded-b-3xl"></div>
              
              {/* Header */}
              <div className="pt-12 pb-8 text-center">
                <h1 className="text-3xl font-bold text-white tracking-wide">GuardianNet</h1>
              </div>
            </div>

            {/* Main Content */}
            <div className="px-6 py-6 bg-gradient-to-b from-cyan-50 to-blue-50 min-h-[600px]">
              {/* Tab Selector */}
              <div className="bg-gray-200 rounded-full p-1 mb-6 flex">
                <button
                  onClick={() => setActiveTab('signin')}
                  className={`flex-1 py-3 rounded-full text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'signin'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                      : 'text-gray-600'
                  }`}
                >
                  Sing In
                </button>
                <button
                  onClick={() => setActiveTab('register')}
                  className={`flex-1 py-3 rounded-full text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'register'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                      : 'text-gray-600'
                  }`}
                >
                  Register
                </button>
              </div>

              {/* Form Card */}
              <div className="bg-white rounded-3xl p-6 shadow-lg">
                {/* Email Input */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                    placeholder=""
                  />
                </div>

                {/* Password Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                    placeholder=""
                  />
                </div>

                {/* Login Button */}
                <button
                  onClick={handleLogin}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                >
                  Login
                </button>
              </div>

              {/* Footer Links */}
              <div className="mt-6 text-center space-y-4">
                <p className="text-sm text-gray-800">
                  Forgot your password?{' '}
                  <button
                    onClick={handleResetPassword}
                    className="text-cyan-400 font-semibold hover:text-cyan-500 transition-colors"
                  >
                    Reset here
                  </button>
                </p>
                
                <button
                  onClick={handleSignUp}
                  className="text-cyan-400 font-semibold text-base hover:text-cyan-500 transition-colors"
                >
                  sing up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}