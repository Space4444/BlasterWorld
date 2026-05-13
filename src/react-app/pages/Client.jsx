import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useSession, signUp, signIn } from '../auth-client'; 


export default function Client() {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    const { data: session } = useSession();
    
    useEffect(() => {
        if (session) {
            navigate('/profile_');
        }
    }, [session]);
    
    async function playAsGuest(e) {
        e.preventDefault();
        navigate('/guest_', { state: { username } });
    }

    async function socialLogin(provider, e) {
        e.preventDefault();

        return signIn.social({
            provider
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

    return (<>
        <Toaster />
        
        <div id="controls">
        <p>⬤ To fly forward press either <b>W</b>, <b>up arrow</b>, or <b>left mouse button</b></p>
        <p>⬤ You can also fly backwards by pressing either <b>S</b>, <b>down arrow</b>, or <b>right mouse button</b></p>
        <p>⬤ To shoot press either <b>SPACEBAR</b>, or <b>middle mouse button</b></p>
        </div>

        <div className="container">

            <h1>Blaster.World</h1>

            <form onSubmit={playAsGuest}>
                <div>
                    <input
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        type='text'
                        placeholder='Nick'
                    />
                </div>

                <button className="btn0">Play as guest</button>
            </form>

            <hr/>

            <br/><br/>

            <div>

                <a href="/login_"><button className="btn">Log In</button></a>
                <a href="/signup_"><button className="btn">Signup</button></a>
                <button className="btn" onClick={e => socialLogin('google', e)}>Sign in with Google</button>

            </div>

        </div>
    </>);
}