import { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AuthContext from "../../context/AuthContext";
import { fetchUserBookings, clearErrors } from "../../redux/slices/booking-slice";
import { fetchTrips } from "../../redux/slices/trip-slice";

export default function MyBookings() {
  const { userState } = useContext(AuthContext);
  const { user } = userState;
  const { bookings, loading: bookingsLoading, error } = useSelector((state) => state.bookings);
  const { trips, loading: tripsLoading } = useSelector((state) => state.trips);
  const dispatch = useDispatch();
  const [fetchAttempted, setFetchAttempted] = useState(false);

  useEffect(() => {
    dispatch(clearErrors());

    console.log("AuthContext userState:", userState);
    console.log("User object:", user);

    if (user && user._id) {
      console.log("Fetching bookings for user:", user._id);

      dispatch(fetchUserBookings(user._id))
        .unwrap()
        .then(result => {
          console.log("Fetched user bookings successfully:", result);
          setFetchAttempted(true);
        })
        .catch(err => {
          console.error("Error fetching user bookings:", err);
          setFetchAttempted(true);
        });

      dispatch(fetchTrips())
        .unwrap()
        .then(result => console.log("Fetched trips successfully:", result))
        .catch(err => console.error("Error fetching trips:", err));
    } else {
      console.warn("User is not logged in or user ID is missing", user);
      setFetchAttempted(true);
    }
  }, [dispatch, user]);

  const isLoading = bookingsLoading || tripsLoading;

  const findTripForBooking = (booking) => {
    if (booking.tripId && typeof booking.tripId === 'object' && booking.tripId._id) {
      return trips.find(t => t._id === booking.tripId._id);
    }
    if (booking.tripId && typeof booking.tripId === 'string') {
      return trips.find(t => t._id === booking.tripId);
    }
    return null;
  };
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-medium">Error: {error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <p className="text-gray-500">Loading bookings...</p>
          </div>
        ) : bookings && bookings.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => {
              const trip = findTripForBooking(booking);
              return (
                <div key={booking._id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {trip ? `${trip.source} to ${trip.destination}` : "Trip details not available"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Journey Date & Time: <span className="font-medium">{formatDate(trip.journeyDatetime)}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Passenger: <span className="font-medium">{booking.name || "N/A"}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Mobile Number: <span className="font-medium">{booking.phoneNumber || "N/A"}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Number of Persons: <span className="font-medium">{booking.numberOfPersons || "N/A"}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Amount Paid: <span className="font-medium text-blue-600">₹{booking.totalAmount || "0"}</span>
                  </p>

                </div>
              );
            })}
          </div>
        ) : fetchAttempted ? (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <p className="text-gray-500">No bookings found.</p>
          </div>
        ) : (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <p className="text-gray-500">Initializing bookings...</p>
          </div>
        )}
      </div>
    </div>
  );
}
