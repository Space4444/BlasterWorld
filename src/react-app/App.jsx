import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Client from './pages/Client';
import Guest from './pages/Guest';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import "./style.css";


function App() {
	return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Client/>} />
                <Route path='client' element={<Client/>} />
                <Route path='guest_' element={<Guest/>} />
                <Route path='login_' element={<Login/>} />
                <Route path='signup_' element={<Signup/>} />
                <Route path='profile_' element={<Profile/>} />
                <Route path='*' element={<NotFound/>} />
            </Routes>
        </BrowserRouter>
	);
}

export default App;




/*
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

//npm run dev -- --host

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='register' element={<Signup/>} />
                <Route path='login' element={<Login/>} />
                <Route path='dashboard' element={<Dashboard/>} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}
    */