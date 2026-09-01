import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaSearch, FaRegClock, FaTicketAlt, FaShieldAlt } from 'react-icons/fa';

const AllEvents = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchEvents();
    }, [user, navigate]);

    useEffect(() => {
            const timeoutId = setTimeout(() => {
                fetchEvents();
            }, 400); // 400ms debounce
            return () => clearTimeout(timeoutId);
        }, [search]);

    const fetchEvents = async () => {
        try {
            const { data } = await api.get(`/events?search=${search}`);
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };


    if (loading) return <div className="text-center py-20 text-xl font-semibold">Loading events...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="w-full max-w-2xl mx-auto relative flex items-center shadow-2xl group rounded-full mb-15">
                <FaSearch className="absolute left-6 text-gray-500 text-xl group-focus-within:text-black transition-colors" />
                <input
                    type="text"
                    placeholder="Search events by title..."
                    className="w-full pl-16 pr-6 py-5 rounded-full text-lg text-black bg-white/95 backdrop-blur-sm border-2 border-transparent focus:border-gray-500 focus:outline-none transition-all placeholder-gray-400 font-medium"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="flex items-center justify-between mb-8 px-2 border-b border-gray-200 pb-4">
                <h2 className="text-3xl font-extrabold text-gray-900">Upcoming Events</h2>
                <div className="text-gray-500 font-medium">{events.filter(event => new Date(event.date) >= new Date()).length} results found</div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-xl font-semibold text-gray-600">Loading events...</div>
            ) : events.filter(event => new Date(event.date) >= new Date()).length === 0 ? (
                <div className="text-center py-20 text-xl text-gray-500">No events found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.filter(event => new Date(event.date) >= new Date()).map(event => (
                        <div key={event._id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition flex flex-col">
                            <div className="h-48 bg-gray-200 overflow-hidden relative">
                                {event.imageUrl ? (
                                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 font-bold text-2xl">
                                        {event.category || 'Event'}
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                                    {event.ticketPrice === 0 ? <span className="text-green-600">FREE</span> : <span className="text-gray-900">₹{event.ticketPrice}</span>}
                                </div>
                            </div>
                            <div className="p-6 flex-grow flex flex-col">
                                <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">{event.category}</div>
                                <h2 className="text-xl font-bold text-gray-800 mb-3">{event.title}</h2>
                                <div className="flex flex-col gap-2 mb-4 text-gray-600 text-sm">
                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt className="text-gray-400" />
                                        <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-gray-400" />
                                        <span>{event.location}</span>
                                    </div>
                                </div>
                                <div className="mt-auto">
                                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                        <div className="bg-gray-700 h-2 rounded-full" style={{ width: `${(event.availableSeats / event.totalSeats) * 100}%` }}></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-4">{event.availableSeats} of {event.totalSeats} seats remaining</p>
                                    <Link to={`/events/${event._id}`} className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2 rounded-lg transition">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex items-center justify-between mb-8 px-2 border-b border-gray-200 pb-4 mt-4.5">
                <h2 className="text-3xl font-extrabold text-gray-900">Expired Events</h2>
                <div className="text-gray-500 font-medium">{events.filter(event => new Date(event.date) < new Date()).length} results found</div>
            </div>
            {loading ? (
                <div className="text-center py-20 text-xl font-semibold text-gray-600">Loading events...</div>
            ) : events.filter(event => new Date(event.date) < new Date()).length === 0 ? (
                <div className="text-center py-20 text-xl text-gray-500">No events found matching your search.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.filter(event => new Date(event.date) < new Date()).map(event => (
                        <div key={event._id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition flex flex-col">
                            <div className="h-48 bg-gray-200 overflow-hidden relative">
                                {event.imageUrl ? (
                                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 font-bold text-2xl">
                                        {event.category || 'Event'}
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                                    {event.ticketPrice === 0 ? <span className="text-green-600">FREE</span> : <span className="text-gray-900">₹{event.ticketPrice}</span>}
                                </div>
                            </div>
                            <div className="p-6 flex-grow flex flex-col">
                                <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">{event.category}</div>
                                <h2 className="text-xl font-bold text-gray-800 mb-3">{event.title}</h2>
                                <div className="flex flex-col gap-2 mb-4 text-gray-600 text-sm">
                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt className="text-gray-400" />
                                        <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-gray-400" />
                                        <span>{event.location}</span>
                                    </div>
                                </div>
                                <div className="mt-auto">
                                    {/* <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                        <div className="bg-gray-700 h-2 rounded-full" style={{ width: `${(event.availableSeats / event.totalSeats) * 100}%` }}></div>
                                    </div> */}
                                    {/* <p className="text-xs text-gray-500 mb-4">{event.availableSeats} of {event.totalSeats} seats remaining</p> */}
                                    <Link to={`/events/${event._id}`} className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2 rounded-lg transition">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllEvents;