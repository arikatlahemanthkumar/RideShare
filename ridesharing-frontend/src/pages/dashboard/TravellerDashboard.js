import { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import AuthContext from "../../context/AuthContext";
import { fetchUserBookings } from "../../redux/slices/booking-slice"
import { fetchTrips } from "../../redux/slices/trip-slice";

export default function TravellerDashboard() {
  const { user } = useContext(AuthContext);
  const { currentBooking, bookings, loading: bookingsLoading } = useSelector((state) => state.bookings);
  const { trips, loading: tripsLoading } = useSelector((state) => state.trips);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

  
  const refreshAllData = async () => {
    if (!user || !user._id) return;

    setRefreshing(true);
    try {
    
      await Promise.all([
        dispatch(fetchUserBookings(user._id)),
        dispatch(fetchTrips())
      ]);

      
      const currentTime = new Date().getTime().toString();
      localStorage.setItem('userBookingsTimestamp', currentTime);
      localStorage.setItem('tripsTimestamp', currentTime);

    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    
    const fetchAndStoreUserBookings = async (userId) => {
      try {
        
        const cachedBookings = localStorage.getItem('userBookings');
        const cachedTimestamp = localStorage.getItem('userBookingsTimestamp');
        const currentTime = new Date().getTime();
         if (cachedBookings && cachedTimestamp &&
          (currentTime - parseInt(cachedTimestamp) < 5 * 60 * 1000)) {
          
          return;
        }
         await dispatch(fetchUserBookings(userId));
        const updatedBookings = JSON.stringify(bookings);
        localStorage.setItem('userBookings', updatedBookings);
        localStorage.setItem('userBookingsTimestamp', currentTime.toString());
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    
    const fetchAndStoreTrips = async () => {
      try {
        
        const cachedTrips = localStorage.getItem('trips');
        const cachedTimestamp = localStorage.getItem('tripsTimestamp');
        const currentTime = new Date().getTime();

        if (cachedTrips && cachedTimestamp &&
          (currentTime - parseInt(cachedTimestamp) < 15 * 60 * 1000)) {
          return;
        }

        
        await dispatch(fetchTrips());

       
        const updatedTrips = JSON.stringify(trips);
        localStorage.setItem('trips', updatedTrips);
        localStorage.setItem('tripsTimestamp', currentTime.toString());
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };

    if ((!bookings || bookings.length === 0) && localStorage.getItem('userBookings')) {
      try {
        const cachedBookings = JSON.parse(localStorage.getItem('userBookings'));
        if (cachedBookings && Array.isArray(cachedBookings) && cachedBookings.length > 0) {
          dispatch({ type: 'bookings/fetchUserBookings/fulfilled', payload: cachedBookings });
        }
      } catch (e) {
        console.error("Error parsing cached bookings:", e);
      }
    }

    
    if ((!trips || trips.length === 0) && localStorage.getItem('trips')) {
      try {
        const cachedTrips = JSON.parse(localStorage.getItem('trips'));
        if (cachedTrips && Array.isArray(cachedTrips) && cachedTrips.length > 0) {
          dispatch({ type: 'trips/fetchTrips/fulfilled', payload: cachedTrips });
        }
      } catch (e) {
        console.error("Error parsing cached trips:", e);
      }
    }

    
    if (user && user._id) {
      fetchAndStoreUserBookings(user._id);
    }

    fetchAndStoreTrips();

  }, [dispatch, user]);

  
  useEffect(() => {
    if (bookings && bookings.length > 0) {
      localStorage.setItem('userBookings', JSON.stringify(bookings));
      localStorage.setItem('userBookingsTimestamp', new Date().getTime().toString());
    }
  }, [bookings]);

  useEffect(() => {
    if (trips && trips.length > 0) {
      localStorage.setItem('trips', JSON.stringify(trips));
      localStorage.setItem('tripsTimestamp', new Date().getTime().toString());
    }
  }, [trips]);

  const isLoading = bookingsLoading || tripsLoading || refreshing;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <Link to="/search-trips" className="block w-full bg-indigo-600 text-white text-center py-2 px-4 rounded-md hover:bg-indigo-700">
                Find a Trip
              </Link>
              <Link to="/my-bookings" className="block w-full bg-indigo-600 text-white text-center py-2 px-4 rounded-md hover:bg-indigo-700">
                My Bookings
              </Link>
              <Link to="/profile" className="block w-full bg-indigo-600 text-white text-center py-2 px-4 rounded-md hover:bg-indigo-700">
                Profile
              </Link>
              <div className="mt-4">
                <button
                  onClick={refreshAllData}
                  disabled={isLoading}
                  className="block w-full bg-gray-100 text-gray-700 text-center py-2 px-4 rounded-md hover:bg-gray-200 disabled:opacity-50"
                >
                  {isLoading ? "Refreshing..." : "Refresh All Data"}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
            <div className="space-y-4">
              {isLoading ? (
                <p className="text-gray-500">Loading booking...</p>
              ) : currentBooking ? (
                <div key={currentBooking._id} className="border-b pb-4 last:border-0">
                  <p className="font-medium">
                    {currentBooking.tripDetails
                      ? `${currentBooking.tripDetails.source} to ${currentBooking.tripDetails.destination}`
                      : "Trip details not available"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {currentBooking.tripDetails?.journeyDatetime
                      ? new Date(currentBooking.tripDetails.journeyDatetime).toLocaleDateString()
                      : "Date not available"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Status:{" "}
                    <span className={currentBooking.isApproved ? "text-green-600" : "text-yellow-600"}>
                      {currentBooking.isApproved ? "Approved" : "Pending"}
                    </span>
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">No recent booking found.</p>
              )}

              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}