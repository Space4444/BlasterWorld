import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSession, signUp } from '../auth-client'; 
import { Button } from 'antd';
import toast from 'react-hot-toast';
import Toaster from '../components/Toaster';


export default function Login() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const { data: session } = useSession();

    useEffect(() => window.seed && location.reload(), [window.seed]);
    
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

    <div className="container w-1/2 h-1/2">

        <div className="h-1/2">
            <h1 className="text-3xl leading-loose">Signup</h1>

            <div className="flex items-center justify-center">
                <form onSubmit={signup} id="form">
                    <div>
                        <input
                            className="border-2 border-blue-500 text-white"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            type='text'
                            placeholder='Email'
                            required
                        />
                    </div>
                    <div>
                        <input
                            className="border-2 border-blue-500 text-white"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            type='password'
                            placeholder='Password'
                            required
                        />
                    </div>
                    <div>
                        <input
                            className="border-2 border-blue-500 text-white"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            type='password'
                            placeholder='Confirm password'
                            required
                        />
                    </div>

                    <Button type="primary" className="m-1" htmlType="submit">Signup</Button>
                </form>
            </div>
        </div>

        <hr/>

        <div className="h-1/2 flex items-center justify-center">
            <div>
                <p>Play as guest</p>

                <form onSubmit={playAsGuest}>
                    <div>
                        <input
                            className="border-2 border-blue-500 text-white"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            type='text'
                            placeholder='Nick'
                        />
                    </div>

                    <Button type="primary" className="m-1" htmlType="submit">Play</Button>
                </form>

                <p>Already have an account? <Link to="/login_"><Button type="link" size="large">Login</Button></Link></p>
                <p>Or go <Link to="/"><Button type="link" size="large">home</Button></Link>.</p>
            </div>
        </div>
    </div>

    </>);
}
