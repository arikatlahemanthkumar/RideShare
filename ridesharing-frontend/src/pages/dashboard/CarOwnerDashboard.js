import { useEffect, useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { fetchMyCars } from "../../redux/slices/car-slice";
import { fetchMyTrips } from "../../redux/slices/trip-slice";

export default function CarOwnerDashboard() {
    const dispatch = useDispatch();
    const { userState } = useContext(AuthContext);
    const { user } = userState
    const { cars, loading: carsLoading, error: carsError } = useSelector((state) => state.cars);
    const { trips, loading: tripsLoading, error: tripsError } = useSelector((state) => state.trips);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

   
    useEffect(() => {
        console.log("Component mounted. User:", userState);

        if (user?._id) {
            console.log("Fetching cars and trips for user:", user._id);
            dispatch(fetchMyCars());
            dispatch(fetchMyTrips());
            setIsDataLoaded(true);
        }
    }, [dispatch, user]);

    
    useEffect(() => {
        console.log("Cars from Redux:", cars);
        console.log("Trips from Redux:", trips);
    }, [cars, trips]);

   
    const ownerCars = cars && Array.isArray(cars) ?
        cars.filter(car => car.carOwnerId?._id === user?._id) : [];

    console.log("User ID:", user?._id);
    console.log("Filtered Owner Cars:", ownerCars);




    
    const activeTrips = trips && Array.isArray(trips) ?
        trips.filter(trip => new Date(trip.journeyDatetime) > new Date()) : [];

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

                    
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                        <div className="space-y-4">
                            <Link to="/create-trip" className="block w-full bg-indigo-600 text-white text-center py-2 px-4 rounded-md hover:bg-indigo-700">
                                Create New Trip
                            </Link>
                            <Link to="/add-car" className="block w-full bg-gray-100 text-gray-700 text-center py-2 px-4 rounded-md hover:bg-gray-200">
                                Add New Car
                            </Link>
                            <button
                                onClick={() => {
                                    dispatch(fetchMyCars());
                                    dispatch(fetchMyTrips());
                                }}
                                className="block w-full bg-gray-100 text-gray-700 text-center py-2 px-4 rounded-md hover:bg-gray-200"
                            >
                                Refresh All Data
                            </button>
                        </div>
                    </div>

                    
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Active Trips</h2>
                        <div className="space-y-4">
                            {tripsLoading ? (
                                <p>Loading trips...</p>
                            ) : tripsError ? (
                                <p className="text-red-500">Error loading trips</p>
                            ) : activeTrips.length > 0 ? (
                                activeTrips.map((trip) => (
                                    <div key={trip._id} className="border-b pb-4">
                                        <p className="font-medium">{trip.source} → {trip.destination}</p>
                                        <p className="text-sm text-gray-500">{new Date(trip.journeyDatetime).toLocaleDateString()}</p>
                                        <p className="text-sm text-gray-500">{trip.seats?.filter(seat => seat.isBooked).length || 0} / {trip.seats?.length || 0} seats booked</p>
                                    </div>
                                ))
                            ) : (
                                <p>No active trips found</p>
                            )}
                        </div>
                    </div>

                    
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">My Cars</h2>
                        <div className="space-y-4">
                            {carsLoading ? (
                                <p>Loading cars...</p>
                            ) : carsError ? (
                                <p className="text-red-500">Error loading cars</p>
                            ) : ownerCars.length > 0 ? (
                                ownerCars.map((car) => (
                                    <div key={car._id} className="border-b pb-4">
                                        <p className="font-medium">{car.carModel || "Car"}</p>
                                        <p className="text-sm text-gray-500">Registration: {car.carNumber || "N/A"}</p>
                                        <p className="text-sm text-gray-500">
                                            Status: {car.isApproved ? (
                                                <span className="text-green-600">Approved</span>
                                            ) : (
                                                <span className="text-yellow-600">Pending Approval</span>
                                            )}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p>No cars found</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
