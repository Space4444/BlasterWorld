import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useSession, signUp } from '../auth-client'; 
import { useNavigate } from 'react-router-dom';


export default function Login() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const { data: session } = useSession();
    
    useEffect(() => {
        if (session) {
            navigate('/profile_');
        }
    }, [session]);

    function signup(e) {
        e.preventDefault();

        const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

        if ( !reg.test(email) ) {
            toast.error('Invalid email');
            return
        }
        
        if (password !== confirmPassword) {
            toast.error('Passwords don\'t match');
            return
        }

        return signUp.email({ 
            email, 
            password, 
            name: email.split('@')[0],
            // callbackURL: "/dashboard" // Optional: where to go after verification
        }, { 
            onSuccess: () => {
                toast.success('Registration successful!');
                navigate('/profile_');
            },
            onError: (ctx) => {
                toast.error(ctx.error.message);
            }
        });
    }

    async function playAsGuest(e) {
        e.preventDefault();
        navigate('/guest_', { state: { username } });
    }

    return (<>

    <Toaster />

    <div className="container">

        <h1>Signup</h1>

        <form onSubmit={signup} id="form">
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
            <div>
                <input
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    type='password'
                    placeholder='Confirm password'
                    required
                />
            </div>

            <button className="btn0">Signup</button>
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

        <p>Already have an account? <a href="/login_" className="lnk">Login</a></p>
        <p>Or go <a href="/" className="lnk">home</a>.</p>

    </div>

    </>);
}
