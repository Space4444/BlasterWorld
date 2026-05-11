import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Client from './pages/Client';
import Guest from './pages/Guest';
import NotFound from './pages/NotFound';
import "./style.css";


function App() {
	return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Client/>} />
                <Route path='client' element={<Client/>} />
                <Route path='guest_' element={<Guest/>} />
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