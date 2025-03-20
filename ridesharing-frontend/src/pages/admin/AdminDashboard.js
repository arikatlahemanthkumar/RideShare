import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Car, Users, CreditCard, CheckCircle } from 'lucide-react';
import { fetchUsers, fetchCars } from "../../redux/slices/admin-slice";
import { fetchBookings } from "../../redux/slices/booking-slice";
import { getAllPayments } from "../../redux/slices/payment-slice";


ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState("analytics");

   
    const { users, cars, loading: adminLoading } = useSelector((state) => state.admin);
    const { bookings, loading: bookingsLoading } = useSelector((state) => state.bookings);
    const { allPayments, loading: paymentsLoading } = useSelector((state) => state.payments)
    const successfulPayments = allPayments.filter(payment => payment.paymentStatus === 'succeeded');

   
    const carOwnerCount = users?.filter(user => user.role === 'carOwner').length || 0;
    const travellerCount = users?.filter(user => user.role === 'traveller').length || 0;
    const totalUsers = users?.length || 0;
    const approvedCars = cars?.filter(car => car.isApproved).length || 0;

   
    const revenueByMonth = Array(12).fill(0);
    const totalAdminRevenue = successfulPayments.reduce((acc, payment) => acc + (payment.adminFee || 0), 0);

    successfulPayments.forEach(payment => {
        if (payment.paymentDate) {
            const monthIndex = new Date(payment.paymentDate).getMonth();
            revenueByMonth[monthIndex] += payment.adminFee || 0;
        }
    });

    
    const pieData = {
        labels: ["Car Owners", "Travellers"],
        datasets: [
            {
                data: [carOwnerCount, travellerCount],
                backgroundColor: ["#4F46E5", "#10B981"],
                hoverBackgroundColor: ["#3B3CC4", "#0D9C6E"],
            },
        ],
    };

    const getUsersPerMonth = () => {
        const months = Array(12).fill(0);
        users?.forEach(user => {
            if (user.createdAt) {
                const monthIndex = moment(user.createdAt).month();
                months[monthIndex] += 1;
            }
        });

        return {
            labels: months.map((_, index) => moment().month(index).format("MMM")),
            datasets: [
                {
                    label: "New Users",
                    data: months,
                    backgroundColor: "rgba(79, 70, 229, 0.6)",
                    borderColor: "rgba(79, 70, 229, 1)",
                    borderWidth: 1,
                },
            ],
        };
    };

    const revenueData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
            {
                label: "Revenue (₹)",
                data: revenueByMonth,
                fill: false,
                borderColor: "#10B981",
                backgroundColor: "#10B981",
                tension: 0.1,
            },
        ],
    };

    useEffect(() => {
        
        dispatch(fetchUsers({ limit: 1000 }));
        dispatch(fetchCars());
        dispatch(fetchBookings());
        dispatch(getAllPayments())
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            
            <div className="flex justify-center space-x-8 border-b border-gray-300 mb-10 bg-white shadow-md rounded-lg">
                {["analytics", "revenue"].map((page) => (
                    <button
                        key={page}
                        className={`text-lg font-medium px-6 py-4 focus:outline-none transition-colors
                            ${currentPage === page
                                ? "text-indigo-600 border-b-2 border-indigo-600"
                                : "text-gray-600 hover:text-indigo-500"
                            }`}
                        onClick={() => setCurrentPage(page)}
                    >
                        {page.charAt(0).toUpperCase() + page.slice(1)}
                    </button>
                ))}
            </div>

            {(adminLoading || bookingsLoading) && (
                <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            )}

            {currentPage === "analytics" && !adminLoading && !bookingsLoading && (
                <div className="space-y-8">
                   
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500">Total Users</p>
                                    <p className="text-2xl font-bold">{totalUsers}</p>
                                </div>
                                <Users className="h-8 w-8 text-indigo-600" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500">Car Owners</p>
                                    <p className="text-2xl font-bold">{carOwnerCount}</p>
                                </div>
                                <Car className="h-8 w-8 text-green-600" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500">Travelers</p>
                                    <p className="text-2xl font-bold">{travellerCount}</p>
                                </div>
                                <Users className="h-8 w-8 text-blue-600" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500">Active Cars</p>
                                    <p className="text-2xl font-bold">{approvedCars}</p>
                                </div>
                                <Car className="h-8 w-8 text-yellow-600" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500">Successful Payments</p>
                                    <p className="text-2xl font-bold">{successfulPayments.length}</p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-yellow-600" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500">Admin Revenue</p>
                                    <p className="text-2xl font-bold">₹{totalAdminRevenue.toLocaleString()}</p>
                                </div>
                                <CreditCard className="h-8 w-8 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-lg font-semibold mb-4">User Distribution</h3>
                            <div className="h-80">
                                <Pie data={pieData} options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                        }
                                    }
                                }} />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-lg font-semibold mb-4">Monthly User Growth</h3>
                            <div className="h-80">
                                <Bar data={getUsersPerMonth()} options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                }} />
                            </div>
                        </div>
                    </div>

                   
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">Car Statistics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="border p-4 rounded-lg">
                                <p className="text-gray-500">Total Cars</p>
                                <p className="text-xl font-bold">{cars?.length || 0}</p>
                            </div>
                            <div className="border p-4 rounded-lg">
                                <p className="text-gray-500">Approved Cars</p>
                                <p className="text-xl font-bold">{approvedCars}</p>
                            </div>
                            <div className="border p-4 rounded-lg">
                                <p className="text-gray-500">Average Price/Day</p>
                                <p className="text-xl font-bold">
                                    ₹{cars?.length > 0 
                                        ? Math.round(cars.reduce((sum, car) => sum + (car.pricePerDay || 0), 0) / cars.length) 
                                        : 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {currentPage === "revenue" && !bookingsLoading && !paymentsLoading && (
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">Monthly Admin Revenue</h3>
                        <div className="h-96">
                            <Line data={revenueData} options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            callback: (value) => `₹${value.toLocaleString()}`
                                        }
                                    }
                                }
                            }} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500">Total Admin Revenue</p>
                                    <p className="text-2xl font-bold">₹{totalAdminRevenue.toLocaleString()}</p>
                                </div>
                                <CreditCard className="h-8 w-8 text-green-600" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500">Total Bookings</p>
                                    <p className="text-2xl font-bold">{bookings?.length || 0}</p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-blue-600" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500">Successful Payments</p>
                                    <p className="text-2xl font-bold">{successfulPayments.length}</p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-blue-600" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500">Average Admin fee</p>
                                    <p className="text-2xl font-bold">
                                        ₹{successfulPayments.length ? Math.round(totalAdminRevenue / successfulPayments.length).toLocaleString() : 0}
                                    </p>
                                </div>
                                <CreditCard className="h-8 w-8 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">Recent Successful Payments</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 border-b text-left">Payment ID</th>
                                        <th className="px-6 py-3 border-b text-left">Date</th>
                                        <th className="px-6 py-3 border-b text-right">Admin Fee</th>
                                        <th className="px-6 py-3 border-b text-right">Car Owner Fee</th>
                                        <th className="px-6 py-3 border-b text-left">Payment Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {successfulPayments.slice(0, 5).map((payment, index) => (
                                        <tr key={payment._id || index}>
                                            <td className="px-6 py-4 border-b">{payment._id?.substring(0, 8) || 'N/A'}</td>
                                            <td className="px-6 py-4 border-b">
                                                {payment.paymentDate ? moment(payment.paymentDate).format('lll') : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 border-b text-right">
                                                ₹{payment.adminFee?.toLocaleString() || 0}
                                            </td>
                                            <td className="px-6 py-4 border-b text-right">
                                                ₹{payment.carOwnerFee?.toLocaleString() || 0}
                                            </td>
                                            <td className="px-6 py-4 border-b">
                                                {payment.paymentType || 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;