import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useSession, signIn } from '../auth-client'; 
import { useNavigate } from 'react-router-dom';


export default function Login() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { data: session } = useSession();
    
    useEffect(() => {
        if (session) {
            navigate('/profile_');
        }
    }, [session]);

    async function login(e) {
        e.preventDefault();

        const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

        if ( !reg.test(email) ) {
            toast.error('Invalid email');
            return
        }

        return signIn.email({
            email,
            password
        }, {
            onSuccess: () => {
                toast.success('Login successful!');
                navigate('/profile_');
            },
            onError: (ctx) => {
                toast.error(ctx.error.message);
            },
        });
    }

    async function playAsGuest(e) {
        e.preventDefault();
        navigate('/guest_', { state: { username } });
    }

    return (<>

    <Toaster />
    
    <div className="container">

        <h1>Login</h1>

        <form onSubmit={login}>
            <div>
                <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    type='text'
                    placeholder='Email'
                    required
                />
            </div>
            <div>
                <input
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type='password'
                    placeholder='Password'
                    required
                />
            </div>

            <button className="btn0">Login</button>
        </form>

        <hr/>

        <p>Play as guest</p>

        <form onSubmit={playAsGuest}>
            <div>
                <input
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    type='text'
                    placeholder='Nick'
                />
            </div>

            <button className="btn0">Play</button>
        </form>

        <p>Need an account? <a href="/signup_" className="lnk">Signup</a></p>
        <p>Or go <a href="/" className="lnk">home</a>.</p>

    </div>

    </>);
}
