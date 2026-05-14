import { Toaster as ToasterOriginal } from 'react-hot-toast';


export default function Toaster() {
    return <ToasterOriginal
        toastOptions={{
        style: {
            border: '1px solid #333',
            padding: '16px',
            color: '#fff',
            background: '#333',
        }}}
    />
}