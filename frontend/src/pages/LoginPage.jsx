
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function LoginPage() {
    const navigate = useNavigate();
    const {login} = useAuth();
    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");

    const [error,setError]=useState(null);
    const [loading,setLoading]=useState(false);

    async function handleSubmit(event){
        event.preventDefault();

        setLoading(true);
        setError(null);

        try{
            await login(username,password);
            navigate("/");
        }catch(err){
            setError(err.message);
        }finally{
            setLoading(false);
        }
    }

  return (
    <div>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
            </button>
        </form>
             

    </div>
  )
}
