import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Client from './client.jsx';
import Guest from './guest.jsx';
import NotFound from './NotFound';
import "./style.css";


function App() {
	return (
        <BrowserRouter>
            <Routes>
                <Route path='/f' element={<Guest/>} />
                <Route path='guestt_' element={<Guest/>} />
                <Route path='*' element={<NotFound/>} />
            </Routes>
        </BrowserRouter>
	);
}

export default App;




/*
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

//npm run dev -- --host

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='register' element={<Register/>} />
                <Route path='login' element={<Login/>} />
                <Route path='dashboard' element={<Dashboard/>} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}
    */