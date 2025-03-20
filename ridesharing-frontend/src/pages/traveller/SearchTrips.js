import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchTrips } from "../../redux/slices/trip-slice";
import { createBooking, setCurrentBooking } from "../../redux/slices/booking-slice";
import { getTravellerProfile } from "../../redux/slices/traveller-slice";

export default function SearchTrips() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { trips, loading } = useSelector((state) => state.trips);
  const {profile} = useSelector((state)=> state.traveller)
 
  const [search, setSearch] = useState({
    source: '',
    destination: '',
    date: '',
  });
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [profileLoaded,setProfileLoaded] = useState(false)
  const [dateMessage, setDateMessage] = useState('');


  useEffect(()=>{
    dispatch(getTravellerProfile())
    .unwrap()
    .then(()=>setProfileLoaded(true))
    .catch((error)=>{
      console.error("Error fetching Profile:" , error)
      setProfileLoaded(true)
    })
  },[dispatch])

  const handleSearch = (e) => {
    e.preventDefault();
    const selectedDate = new Date(search.date);
    selectedDate.setHours(0, 0, 0, 0); 
    
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); 
    
    if (selectedDate < currentDate) {
      setDateMessage('No trips available for past dates.');
    } else {
      setDateMessage('');
    }
    dispatch(fetchTrips(search));
  };

  const handleChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const handleSeatClick = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleTripSelect = (trip) => {
    setSelectedTrip(trip);
    setSelectedSeats([]);
  };

  useEffect(() => {
    console.log("Current profile data:", profile);
  }, [profile]);

  const handleBooking = () => {
    if (selectedTrip && selectedSeats.length > 0) {
      const tripDate = new Date(selectedTrip.journeyDatetime);
      tripDate.setHours(0, 0, 0, 0); 
      
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); 
      
      if (tripDate < currentDate) {
        alert("Cannot book trips for past dates.");
        return;
      }
      
      setBookingInProgress(true);
      
      const bookingDetails = {
        tripId: selectedTrip._id,
        seats: selectedSeats.map(seat => ({ seatId: seat, isBooked: true })),
        totalAmount: selectedSeats.length * selectedTrip.amount,
        name: profile?.name||"traveller", 
        phoneNumber: profile?.mobileNumber|| "9492906798", 
        numberOfPersons: selectedSeats.length,
        source: selectedTrip.source,
        destination: selectedTrip.destination,
        departureTime: selectedTrip.departureTime,
        journeyDatetime: selectedTrip.journeyDatetime,
        status: "booked" 
      };
      
      console.log("Booking Details:", bookingDetails);
      
      
      dispatch(setCurrentBooking({
        ...bookingDetails,
        tripDetails: selectedTrip
      }));
      
      
      dispatch(createBooking(bookingDetails))
        .unwrap()
        .then((response) => {
          console.log("Booking successful:", response);
          
         
          const completeBookingDetails = {
            ...response,
            tripDetails: selectedTrip,
            selectedSeats: selectedSeats
          };
          
         
          localStorage.setItem('currentBooking', JSON.stringify(completeBookingDetails));
          dispatch(setCurrentBooking(completeBookingDetails));
          setTimeout(() => {
            navigate('/booking-confirmation');
            setBookingInProgress(false);
          }, 300);
        })
        .catch((error) => {
          console.error("Booking failed:", error);
          setBookingInProgress(false);
          
          if (error.response && error.response.data) {
            alert(`Booking failed: ${error.response.data.message || error.response.data.errors || "Please try again."}`);
          } else if (typeof error === 'string') {
            alert(`Booking failed: ${error}`);
          } else {
            alert("Booking failed. Please try again.");
          }
        });
    } else {
      alert("Please select a trip and seats before booking.");
    }
  };

  const renderSeats = (totalSeats, bookedSeats) => {
    const seats = [];
    for (let i = 1; i <= totalSeats; i++) {
      const seatId = `S${i}`;
      const isBooked = bookedSeats.includes(seatId);
      const isSelected = selectedSeats.includes(seatId);
      seats.push(
        <button
          key={seatId}
          onClick={() => !isBooked && handleSeatClick(seatId)}
          disabled={isBooked}
          className={`
                        w-12 h-12 m-1 rounded-lg font-semibold
                        ${isBooked ? 'bg-gray-300 cursor-not-allowed' :
              isSelected ? 'bg-green-500 text-white' :
                'bg-white border-2 border-gray-300 hover:border-indigo-500'}
                    `}
        >
          {i}
        </button>
      );
    }
    return seats;
  };

  
  const filteredTrips = trips.filter(trip => {
    
    if (!trip.journeyDatetime) {
      console.error(`Invalid trip date: ${trip.journeyDatetime}`);
      return false; 
    }

    const tripDateTime = new Date(trip.journeyDatetime);
    if (isNaN(tripDateTime.getTime())) {
      console.error(`Invalid trip date: ${trip.journeyDatetime}`);
      return false; 
    }

    const tripDate = tripDateTime.toISOString().split('T')[0]; 
    const searchDate = new Date(search.date);
    
    
    if (isNaN(searchDate.getTime())) {
      console.error(`Invalid search date: ${search.date}`);
      return false; 
    }

    return (
      trip.source.toLowerCase() === search.source.toLowerCase() &&
      trip.destination.toLowerCase() === search.destination.toLowerCase() &&
      tripDate === searchDate.toISOString().split('T')[0] 
    );
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Search Available Trips</h2>
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">From</label>
            <input
              type="text"
              name="source"
              value={search.source}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">To</label>
            <input
              type="text"
              name="destination"
              value={search.destination}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={search.date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            className="md:col-span-3 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Search Trips
          </button>
        </form>

        {loading ? (
          <div className="mt-6 text-center">Loading...</div>
        ) : (
          <div className="mt-6">
            {filteredTrips.length > 0 ? (
              filteredTrips.map((trip) => (
                <div
                  key={trip._id}
                  className={`border rounded-lg p-4 mb-4 ${selectedTrip?._id === trip._id ? 'border-indigo-500' : ''}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{trip.source} to {trip.destination}</h3>
                      <p className="text-gray-600">Date: {new Date(trip.journeyDatetime).toLocaleDateString()}</p>
                      <p className="text-gray-600">Time: {new Date(trip.journeyDatetime).toLocaleTimeString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">₹{trip.amount}</p>
                      <p className="text-sm text-gray-500">
                        {trip.seats.filter(seat => !seat.isBooked).length} seats left
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleTripSelect(trip)}
                    className={`mt-4 w-full py-2 px-4 rounded-md ${selectedTrip?._id === trip._id
                      ? 'bg-indigo-200 text-indigo-800'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    {selectedTrip?._id === trip._id ? 'Selected' : 'Select Trip'}
                  </button>

                  {selectedTrip?._id === trip._id && (
                    <div className="mt-4">
                      <h4 className="text-lg font-semibold mb-2">Select Seats</h4>
                      <div className="flex flex-wrap gap-2">
                        {renderSeats(trip.seats.length, trip.seats.filter(s => s.isBooked).map(s => s.seatId))}
                      </div>
                      {selectedSeats.length > 0 && (
                        <div className="mt-4">
                          <p className="text-lg font-semibold">
                            Total: ₹{selectedSeats.length * trip.amount}
                          </p>
                          <button
                            onClick={handleBooking}
                            disabled={bookingInProgress}
                            className={`mt-2 w-full py-2 px-4 rounded-md text-white 
                              ${bookingInProgress 
                                ? 'bg-gray-500 cursor-not-allowed' 
                                : 'bg-green-600 hover:bg-green-700'} 
                              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
                          >
                            {bookingInProgress ? 'Processing...' : `Book ${selectedSeats.length} Seat(s)`}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="mt-6 text-center">No trips found for the selected criteria.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}