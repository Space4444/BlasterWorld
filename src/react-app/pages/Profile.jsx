import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSession, signOut } from '../auth-client';
import { Button } from 'antd';
import toast from 'react-hot-toast';
import Toaster from '../components/Toaster';


export default function Profile() {
    const navigate = useNavigate();
    const { data: session, isPending } = useSession();

    useEffect(() => window.seed && location.reload(), [window.seed]);

    useEffect(() => {
        if (!isPending && !session) {
            navigate('/');
        }
    }, [session, isPending]);

    function logOut() {
        return signOut({
            fetchOptions: {
                onSuccess: () => {
                    toast.success('Logout successful!');
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message);
                }
            }
        });
    }

    return (<>

    <Toaster />

    <div id="controls">
    <p>⬤ To fly forward press either <b>W</b>, <b>up arrow</b>, or <b>left mouse button</b></p>
    <p>⬤ You can also fly backwards by pressing either <b>S</b>, <b>down arrow</b>, or <b>right mouse button</b></p>
    <p>⬤ To shoot press either <b>SPACEBAR</b>, or <b>middle mouse button</b></p>
    </div>

    <div className="container w-1/2 h-1/2">
        <div className="h-1/2">
            <h1 className="text-3xl leading-loose">Galactic Battles</h1>
            
            <div className="flex items-center justify-center">
                {session && <p className="text-3xl leading-loose font-bold">Welcome, {session.user.name}!</p>}
            </div>
        </div>
        
        <hr/>

        <div className="h-1/2 flex items-center justify-center">
            <div>
                <p><Link to="/guest_"><Button type="primary" size="large" className="m-1" style={{padding:10}}>Play!</Button></Link></p>
                <p><Button onClick={logOut} type="link" size="large">Logout</Button></p>
            </div>
        </div>
    </div>

    </>);
}
