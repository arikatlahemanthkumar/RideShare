import { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTrip } from "../../redux/slices/trip-slice";
import { fetchMyCars } from "../../redux/slices/car-slice";
import AuthContext from "../../context/AuthContext";
import { toast } from "react-toastify"; 
import { useNavigate } from "react-router-dom"; 

export default function CreateTrip() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cars } = useSelector((state) => state.cars);
    const { loading, error } = useSelector((state) => state.trips);
    const { userState } = useContext(AuthContext);
    const user = userState.user;
    const [tripDetails, setTripDetails] = useState({
        source: '',
        destination: '',
        journeyDatetime: '',
        carId: '',
        amount: '',
        availableSeats: 0
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    
    useEffect(() => {
        dispatch(fetchMyCars());
    }, [dispatch]);

   
    useEffect(() => {
        console.log("User's cars:", cars);
    }, [cars]);

    
    useEffect(() => {
        if (error) {
            toast.error(`Failed to create trip: ${error}`);
            setIsSubmitting(false);
        }
    }, [error]);

    const handleChange = (e) => {
        setTripDetails({ ...tripDetails, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            
            if (!tripDetails.carId) {
                toast.error("Please select a car");
                setIsSubmitting(false);
                return;
            }

            
            const selectedCar = cars.find(car => car._id === tripDetails.carId);
            if (selectedCar && !selectedCar.approved) {
                toast.warning("The selected car is pending approval. Your trip may not be visible until the car is approved.");
            }

            
            const formattedTripDetails = {
                ...tripDetails,
                journeyDatetime: new Date(tripDetails.journeyDatetime),
                carOwnerId: user?._id,
                seats: Array.from({ length: Number(tripDetails.availableSeats) }, (_, index) => ({
                    seatId: `S${index + 1}`,
                    isBooked: false,
                    userId: null
                }))
            };

            console.log("Creating trip with details:", formattedTripDetails);
            
            
            const resultAction = await dispatch(createTrip(formattedTripDetails));
            
            
            if (resultAction.payload) {
                console.log("Trip created successfully:", resultAction.payload);
                toast.success("Trip created successfully!");
                
                
                setTripDetails({
                    source: '',
                    destination: '',
                    journeyDatetime: '',
                    carId: '',
                    amount: '',
                    availableSeats: 0
                });
                
                
                setTimeout(() => {
                    navigate("/car-owner-dashboard");
                }, 2000);
            } else {
                console.error("Failed to create trip:", resultAction.error);
                toast.error("Failed to create trip. Please try again.");
            }
        } catch (err) {
            console.error("Error submitting trip form:", err);
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Create New Trip</h2>
                {loading && <p className="text-center text-gray-500">Creating trip...</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">From:</label>
                        <input
                            type="text"
                            name="source"
                            value={tripDetails.source}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-500 bg-gray-100 p-2 shadow-md focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">To:</label>
                        <input
                            type="text"
                            name="destination"
                            value={tripDetails.destination}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-500 bg-gray-100 p-2 shadow-md focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Journey Date & Time</label>
                        <input
                            type="datetime-local"
                            name="journeyDatetime"
                            value={tripDetails.journeyDatetime}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-500 bg-gray-100 p-2 shadow-md focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Select Car</label>
                        <select
                            name="carId"
                            value={tripDetails.carId}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-500 bg-gray-100 p-2 shadow-md focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500"
                            required
                        >
                            <option value="">Select a Car</option>
                            {cars && cars.length > 0 ? (
                                cars.map(car => (
                                    <option key={car._id} value={car._id}>
                                        {car.carModel} - {car.carNumber} 
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>No cars available</option>
                            )}
                        </select>
                        {cars && cars.length === 0 && (
                            <p className="mt-2 text-sm text-red-600">
                                You need to add a car before creating a trip. 
                                <a href="/cars/add" className="ml-1 text-indigo-600 hover:text-indigo-500">
                                    Add a car
                                </a>
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price Per Seat</label>
                        <input
                            type="number"
                            name="amount"
                            value={tripDetails.amount}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-500 bg-gray-100 p-2 shadow-md focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500"
                            required
                            min="1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Available Seats</label>
                        <input
                            type="number"
                            name="availableSeats"
                            value={tripDetails.availableSeats}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-500 bg-gray-100 p-2 shadow-md focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500"
                            required
                            min="1"
                            max={cars.find(car => car._id === tripDetails.carId)?.seatingCapacity || 10}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        disabled={isSubmitting || loading || cars.length === 0}
                    >
                        {isSubmitting || loading ? "Creating Trip..." : "Create Trip"}
                    </button>
                </form>
            </div>
        </div>
    );
}