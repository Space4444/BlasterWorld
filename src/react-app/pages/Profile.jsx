import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useSession, signOut } from '../auth-client';


export default function Profile() {
    const navigate = useNavigate();
    const { data: session, isPending } = useSession();

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
                    navigate('/');
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

    <div className="container">

        <h1>Blaster.World</h1>

        {session && <p>Welcome, {session.user.name}!</p>}

        <hr/>

        <p><a href="/guest_"><button className="play">Play!</button></a></p>
        <p><a onClick={logOut} className="lnk">Logout</a></p>

    </div>

    </>);
}
