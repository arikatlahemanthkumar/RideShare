import { useState } from "react";
import { useDispatch } from "react-redux";
import { addCar } from "../../redux/slices/car-slice";
import {toast} from "react-toastify"

const AddCar = () => {
    const dispatch = useDispatch();
    const [carDetails, setCarDetails] = useState({
        carModel: "",
        carNumber: "",
        seatingCapacity: "",
        photos: null, 
        insurance: null, 
        drivingLicence: null, 
        source: "",
        destination: "",
        departureDateTime: "",
        price: "",
        mobileNumber: "",
        pickupLocation: "",
    });
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        
        const formData = new FormData();
        for (const key in carDetails) {
            formData.append(key, carDetails[key]);
        }

        try {
            await dispatch(addCar(formData)); 
            toast.success("Car added successfully!")
            setCarDetails({
                carModel: "",
                carNumber: "",
                seatingCapacity: "",
                photos: null,
                insurance: null,
                drivingLicence: null,
                source: "",
                destination: "",
                departureDateTime: "",
                price: "",
                mobileNumber: "",
                pickupLocation: "",
            });
        } catch (error) {
            console.error("Error adding car:", error);
            toast.error("Failed to add car. Please try again.")
            
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCarDetails({ ...carDetails, [name]: value });
    };

    const handleFileChange = (e) => {
        const { name } = e.target;
        setCarDetails({ ...carDetails, [name]: e.target.files[0] }); 
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Add your Car</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Car Model:</label>
                    <input
                        type="text"
                        name="carModel"
                        value={carDetails.carModel}
                        onChange={handleChange}
                        className="mt-1 block w-full p-3 border-2 border-gray-400 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Car Number:</label>
                    <input
                        type="text"
                        name="carNumber"
                        value={carDetails.carNumber}
                        onChange={handleChange}
                        className="mt-1 block w-full p-3 border-2 border-gray-400 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Seating Capacity:</label>
                    <input
                        type="number"
                        name="seatingCapacity"
                        value={carDetails.seatingCapacity}
                        onChange={handleChange}
                        className="mt-1 block w-full p-3 border-2 border-gray-400 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Photos:</label>
                    <input
                        type="file"
                        name="photos"
                        accept="image/*"
                        onChange={handleFileChange} 
                        className="mt-1 block w-full p-3 border-2 border-gray-400 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Insurance:</label>
                    <input
                        type="file"
                        name="insurance"
                        accept="image/*,application/pdf"
                        onChange={handleFileChange} 
                        className="mt-1 block w-full p-3 border-2 border-gray-400 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Upload Driving Licence:</label>
                    <input
                        type="file"
                        name="drivingLicence"
                        accept="image/*,application/pdf"
                        onChange={handleFileChange}
                        className="mt-1 block w-full p-3 border-2 border-gray-400 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Source:</label>
                    <input
                        type="text"
                        name="source"
                        value={carDetails.source}
                        onChange={handleChange}
                        className="mt-1 block w-full p-3 border-2 border-gray-400 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Destination:</label>
                    <input
                        type="text"
                        name="destination"
                        value={carDetails.destination}
                        onChange={handleChange}
                        className="mt-1 block w-full p-3 border-2 border-gray-400 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Departure Time:</label>
                    <input
                        type="datetime-local"
                        name="departureDateTime"
                        value={carDetails.departureDateTime}
                        onChange={handleChange}
                        className="mt-1 block w-full p-3 border-2 border-gray-400 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Price per Seat:</label>
                    <input
                        type="number"
                        name="price"
                        value={carDetails.price}
                        onChange={handleChange}
                        className="mt-1 block w-full p-3 border-2 border-gray-400 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Mobile Number:</label>
                    <input
                        type="number"
                        name="mobileNumber"
                        value={carDetails.mobileNumber}
                        onChange={handleChange}
                        className="mt-1 block w-full p-3 border-2 border-gray-400 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Pick up Location:</label>
                    <input
                        type="text"
                        name="pickupLocation"
                        value={carDetails.pickupLocation}
                        onChange={handleChange}
                        className="mt-1 block w-full p-3 border-2 border-gray-400 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Add Car
                </button>
            </form>
        
        </div>
    );
};

export default AddCar;