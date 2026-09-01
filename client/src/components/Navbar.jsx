import React, { useContext } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaTicketAlt } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gray-900 shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center py-4 gap-4">
                    <Link to="/" className="text-white text-2xl font-bold flex items-center gap-2">
                        <FaTicketAlt /> JOININ
                    </Link>
                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                        
                        {user ? (
                            <>
                                <NavLink to="/allevents" className={({isActive})=>`text-gray-200 transition cursor-pointer ${isActive?"font-bold underline text-white":"hover:text-white"}`}>Events</NavLink>
                                <NavLink to={user.role === 'admin' ? '/admin' : '/dashboard'} className={({isActive}) => `text-gray-200 transition ${isActive?"font-bold underline text-white":"hover-text-white"}`}>Dashboard</NavLink>
                                <button onClick={handleLogout} className="bg-gray-700 hover:bg-black text-white px-4 py-2 rounded-md transition">Logout</button>
                            </>
                        ) : (
                            <>
                                <NavLink to="/login"  className={({ isActive}) => `px-4 py-2 rounded-md font-semibold transition ${ isActive ? "bg-white text-gray-900 hover:bg-gray-100":"bg=gray-900 text-white"}`}>Login</NavLink>
                                <NavLink to="/register"  className={({ isActive}) => `px-4 py-2 rounded-md font-semibold transition ${ isActive ? "bg-white text-gray-900 hover:bg-gray-100":"bg=gray-900 text-white"}`}>Sign Up</NavLink>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;