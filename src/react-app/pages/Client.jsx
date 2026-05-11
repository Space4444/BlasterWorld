import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function Client() {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    
    function submit(e) {
        e.preventDefault();

        navigate('/guest_', { state: { username } });
    }

    return (<>
        <div id="controls">
        <p>⬤ To fly forward press either <b>W</b>, <b>up arrow</b>, or <b>left mouse button</b></p>
        <p>⬤ You can also fly backwards by pressing either <b>S</b>, <b>down arrow</b>, or <b>right mouse button</b></p>
        <p>⬤ To shoot press either <b>SPACEBAR</b>, or <b>middle mouse button</b></p>
        </div>

        <div className="container">

            <h1>Blaster.World</h1>

            <form onSubmit={submit}>
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

                <a href="/login"><button className="btn">Log In</button></a>
                <a href="/signup"><button className="btn">Signup</button></a>

            </div>

        </div>
    </>);
}