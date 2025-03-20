import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrips } from "../../redux/slices/trip-slice";

export default function AdminTrips() {
    const dispatch = useDispatch();
    const { trips = [], loading } = useSelector((state) => state.trips || {});

    useEffect(() => {
        dispatch(fetchTrips());
    }, [dispatch]);

    if (loading) {
        return <div className="flex justify-center items-center h-64">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-2">Loading trips...</p>
            </div>
        </div>;
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Active Trips</h2>
            <div className="space-y-4">
                {trips && trips.length > 0 ? (
                    trips.map((trip) => (
                        <div key={trip._id} className="border-b pb-4">
                            <p className="font-medium">
                                {trip.source} to {trip.destination}
                            </p>
                            <p className="text-gray-600">Car: {trip.carId?.carModel || 'Unknown'}</p>
                            <p className="text-sm text-gray-500">
                                Journey Date: {trip.journeyDatetime ? new Date(trip.journeyDatetime).toLocaleDateString() : 'N/A'}
                            </p>
                            <p className="text-sm text-gray-500">Status: {trip.status}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No active trips.</p>
                )}
            </div>
        </div>
    );
}