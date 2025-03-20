import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCars } from "../../redux/slices/admin-slice";

export default function AdminCars() {
    const dispatch = useDispatch();
    const { cars = [], loading } = useSelector((state) => state.admin || {});

    useEffect(() => {
        dispatch(fetchCars());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-2">Loading cars...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">All Cars</h2>
            <div className="space-y-4">
                {cars && cars.length > 0 ? (
                    cars.map((car) => (
                        <div key={car._id} className="border-b pb-4">
                            <h3 className="font-bold text-lg">{car.carModel}</h3>
                            <p className="text-gray-600">Car Owner: {car.carOwnerId?.name || "Unknown"}</p>
                          
                            <p className="text-sm text-gray-500">Registration: {car.carNumber}</p>
                            <p className="text-sm text-gray-500">Seating Capacity: {car.seatingCapacity}</p>

                            {/* Status */}
                            <p className="text-sm font-semibold">
                                Status:{" "}
                                <span className={car.isApproved ? "text-green-600" : "text-red-600"}>
                                    {car.isApproved ? "Approved ✅" : "Pending ❌"}
                                </span>
                            </p>

                            {/* Aadhaar Card */}
                           {/*  {car.aadharCard && (
                                <div className="mt-2">
                                    <p className="font-semibold">Aadhaar Card:</p>
                                    <img src={car.aadharCard} alt="Aadhaar" className="w-40 h-24 object-cover rounded-lg" />
                                </div>
                            )} */}

                            {/* Driving License */}
                            {/* {car.drivingLicence && (
                                <div className="mt-2">
                                    <p className="font-semibold">Driving License:</p>
                                    <img src={car.drivingLicence} alt="Driving Licence" className="w-40 h-24 object-cover rounded-lg" />
                                </div>
                            )} */}

                            {/* Insurance */}
                            {/* {car.insurance && (
                                <div className="mt-2">
                                    <p className="font-semibold">Insurance:</p>
                                    <img src={car.insurance} alt="Insurance" className="w-40 h-24 object-cover rounded-lg" />
                                </div>
                            )} */}

                            {/* Car Photos */}
                           {/*  {car.photos && car.photos.length > 0 && (
                                <div className="mt-2">
                                    <p className="font-semibold">Car Photos:</p>
                                    <div className="flex space-x-2">
                                        {car.photos.map((photo, index) => (
                                            <img key={index} src={photo} alt={`Car ${index + 1}`} className="w-40 h-24 object-cover rounded-lg" />
                                        ))}
                                    </div>
                                </div>
                            )} */}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No cars available.</p>
                )}
            </div>
        </div>
    );
}
