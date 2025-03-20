import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPayment } from "../../redux/slices/payment-slice";

export default function BookingConfirmation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentBooking, loading } = useSelector((state) => state.bookings) || {};
  const [bookingDetails, setBookingDetails] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  useEffect(() => {
    
    if (currentBooking) {
      setBookingDetails(currentBooking);
    } else {
      const storedBooking = localStorage.getItem("currentBooking");
      if (storedBooking) {
        try {
          setBookingDetails(JSON.parse(storedBooking));
        } catch (error) {
          console.error("Error parsing booking data:", error);
          navigate("/search-trips", { replace: true });
        }
      } else {
        
        navigate("/search-trips", { replace: true });
      }
    }
  }, [currentBooking, navigate]);

  const makePayment = async () => {
    if (!bookingDetails) return;
    
    setPaymentProcessing(true);
    
    try {
      
      const paymentData = {
        bookingId: bookingDetails._id,
        travellerId: bookingDetails.travellerId,
        carOwnerId: bookingDetails.carOwnerId || bookingDetails.tripDetails?.carOwnerId||bookingDetails.carOwnerId._id,
        totalAmount: bookingDetails.totalAmount,
        numberOfPersons: bookingDetails.numberOfPersons,
        seats: bookingDetails.seats || bookingDetails.selectedSeats,
        tripId: bookingDetails.tripId || bookingDetails.tripDetails?._id
      };
      console.log(paymentData)
      const response = await dispatch(createPayment(paymentData)).unwrap();
      
      
      localStorage.setItem("stripeId", response.sessionId);
      
      
      window.location = response.url; 
    } catch (err) {
      console.error("Payment initiation failed:", err);
      setPaymentProcessing(false);
      
    }
  };

  if (loading || paymentProcessing) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!bookingDetails) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">No Booking Details</h2>
          <p className="mb-4">No booking details found. Please try again.</p>
          <button
            onClick={() => navigate("/search-trips")}
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
          >
            Return to Search
          </button>
        </div>
      </div>
    );
  }

  
  const tripDetails = bookingDetails.tripDetails || {};
  const selectedSeats = bookingDetails.selectedSeats || 
    (Array.isArray(bookingDetails.seats) ? bookingDetails.seats.map(seat => seat.seatId) : []);
  
  const paymentStatus = bookingDetails.paymentStatus || "pending";

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Booking Confirmation</h2>

        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold mb-2">Booking Details</h3>
          <p><span className="font-medium">Booking ID:</span> {bookingDetails?._id}</p>
          <p><span className="font-medium">Name:</span> {bookingDetails?.name}</p>
          <p><span className="font-medium">Phone:</span> {bookingDetails?.phoneNumber}</p>
          <p>
            <span className="font-medium">Status:</span> 
            <span className={paymentStatus === "paid" ? "text-green-600 font-semibold" : "text-yellow-600 font-semibold"}>
              {paymentStatus === "paid" ? "Confirmed" : "Pending Payment"}
            </span>
          </p>
        </div>

        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold mb-2">Trip Details</h3>
          <p><span className="font-medium">From:</span> {bookingDetails.source || tripDetails.source}</p>
          <p><span className="font-medium">To:</span> {bookingDetails.destination || tripDetails.destination}</p>
          <p><span className="font-medium">Date:</span> {new Date(bookingDetails.journeyDatetime || tripDetails.journeyDatetime).toLocaleDateString()}</p>
          <p><span className="font-medium">Time:</span> {new Date(bookingDetails.journeyDatetime || tripDetails.journeyDatetime).toLocaleTimeString()}</p>
          <p><span className="font-medium">Selected Seats:</span> {selectedSeats.join(", ")}</p>
        </div>

        <div className="border-b pb-4 mb-4"> 
          <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
          <p><span className="font-medium">Number of Seats:</span> {bookingDetails.numberOfPersons}</p>
          <p><span className="font-medium">Price per Seat:</span> ₹{tripDetails.amount || 0}</p>
          <p><span className="font-medium">Total Amount:</span> <span className="text-xl font-bold">₹{bookingDetails.totalAmount}</span></p>
          <p>
            <span className="font-medium">Payment Status:</span> 
            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
              paymentStatus === "paid" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            }`}>
              {paymentStatus === "paid" ? "Paid" : "Pending"}
            </span>
          </p>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate("/search-trips")}
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
          >
            Book Another Trip
          </button>
          
          {paymentStatus === "paid" ? (
            <button
              onClick={() => window.print()}
              className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
            >
              Print Ticket
            </button>
          ) : (
            <button
              onClick={makePayment}
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center"
              disabled={paymentProcessing}
            >
              {paymentProcessing ? "Processing..." : "Pay Now"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}