import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingApprovals, approveCarListing } from "../../redux/slices/admin-slice";

export default function AdminApprovals() {
    const dispatch = useDispatch();
    const { pendingApprovals = [], loading } = useSelector((state) => state.admin || {});

    useEffect(() => {
        dispatch(fetchPendingApprovals());
    }, [dispatch]);

    const handleApprove = (carId) => {
        dispatch(approveCarListing(carId))
            .then(() => {
                dispatch(fetchPendingApprovals());
            })
            .catch(error => {
                console.error("Error approving car listing:", error);
            });
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-2">Loading approvals...</p>
            </div>
        </div>;
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Pending Approvals</h2>
            <div className="space-y-4">
                {pendingApprovals && pendingApprovals.length > 0 ? (
                    pendingApprovals.map((car) => (
                        <div key={car._id} className="border-b pb-4">
                            <p className="font-medium">{car.carModel}</p>
                            <p className="text-gray-600">Owner: {car.carOwnerId?.name || 'Unknown'}</p>
                            <p className="text-sm text-gray-500">Registration: {car.carNumber}</p>
                            <button
                                onClick={() => handleApprove(car._id)}
                                className="mt-2 bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700"
                            >
                                Approve
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No pending approvals.</p>
                )}
            </div>
        </div>
    );
}