import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export default function ApiCall() {
    const navigate = useNavigate();

    useEffect(() => {
        async function callApi() {
            await fetch(location.href);
            navigate('/');
        }
        callApi();
    }, []);
    
    return (
        <p>redirecting...</p>
    );
}