import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState(''); // State for username
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true); // Set loading to true when starting the login process
    setError(null); // Reset any previous error

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // Send both username and password
      });

      const json = await res.json();
      if (res.ok) {
        document.cookie = `username=${username}; max-age=604800; path=/`; // Set username in cookie
        document.cookie = `password=${password}; max-age=604800; path=/`; // Set password in cookie
        router.push('/dashboard');
      } else {
        setError(`Status(${res.status}): ${json.message}`);
      }
    } catch (error) {
      setError(`Error: ${error}`);
    } finally {
      setLoading(false); // Set loading to false once the request is complete
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-semibold text-white text-center mb-6">Login</h1>

        {error && (
          <div className="bg-red-600 text-white p-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        {/* Username input */}
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />

        {/* Password input */}
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />

        {/* Login button */}
        <button
          onClick={handleLogin}
          disabled={loading} // Disable button when loading
          className={`w-full py-3 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </div>
  );
}

