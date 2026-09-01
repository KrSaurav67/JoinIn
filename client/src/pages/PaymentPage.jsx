import React, {useState, useEffect} from 'react';
import { Link, useParams, useNavigate} from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';


const PaymentPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const[paystatus, setStatus] = useState(null);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
    const fetchEvent = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/events/${id}`); // use full backend URL, or a configured proxy
            if (!res.ok) {
                throw new Error(`Request failed: ${res.status}`);
            }
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Expected JSON but got something else — check the API URL");
            }
            const data = await res.json();
            // use data
            setEvent(data);
            setLoading(true);
        } catch (err) {
            console.error("Fetch error:", err.message);
        }
    };
    fetchEvent();
}, [id]);
    
    

    const handlePay = () => {
        // Here you could call a backend API for real payment
        // For now, just redirect back to booking with a flag
        navigate(`/events/${id}`, { state : {paymentStatus:'paid', showOtp: true}});
    };

    const handleCancel = () => {
        navigate(`/events/${id}`, {paymentStatus:'not_paid'});
    };

    return (
        <> 
            {!loading ? (<h2 className="text-xl font-bold mb-4 flex flex-col items-center">Loading Details...</h2>) :
                paystatus===null ? (<div className="p-6 flex items-center flex-col">
            <h2 className="text-xl font-bold mb-4">Bookin Details</h2>
            <h2>Event Name : {event.title}</h2>
            <h2>Event Date : {new Date(event.date).toLocaleDateString()}</h2>
            <p className="font-bold">Ticket Price: ₹500</p>
            <div className="mt-6 flex gap-4">
                <button
                onClick={handlePay}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 hover:shadow-lg transition"
                >
                Pay & Confirm
                </button>
                <button
                onClick={handleCancel}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 hover:shadow-lg transition"
                >
                Cancel
                </button>
            </div>
            </div>)
            :
            paystatus==="paid" ? (<div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
                <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full text-center border-t-8 border-green-500 transform transition-all hover:-translate-y-1">
                    <FaCheckCircle className="text-green-500 text-7xl mx-auto mb-6 drop-shadow-sm" />
                    <h1 className="text-4xl font-black text-gray-900 mb-4">Booking Confirmed!</h1>
                    <p className="text-gray-500 mb-8 text-lg">Your ticket has been booked successfully. A confirmation email has been sent to your registered email address.</p>
                    <div className="space-y-4">
                        <Link to="/dashboard" className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition shadow-lg hover:shadow-xl">
                            View My Tickets
                        </Link>
                        <Link to="/" className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-xl transition">
                            Discover More Events
                        </Link>
                    </div>
                </div>
            </div>)
            :
            paystatus==="failed" && (<div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
                        <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full text-center border-t-8 border-red-500 transform transition-all hover:-translate-y-1">
                            <FaTimesCircle className="text-red-500 text-7xl mx-auto mb-6 drop-shadow-sm" />
                            <h1 className="text-4xl font-black text-gray-900 mb-4">Booking Failed</h1>
                            <p className="text-gray-500 mb-8 text-lg">We couldn't process your payment. Please ensure your payment details are correct and try again.</p>
                            <div className="space-y-4">
                                <Link to="/" className="block w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-xl transition shadow-lg hover:shadow-xl">
                                    Return to Events
                                </Link>
                                <Link to="/dashboard" className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-xl transition">
                                    Go to Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>)}
        </>
    );
};

export default PaymentPage;