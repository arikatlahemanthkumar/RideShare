import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Car,Users,CheckSquare, CarFront, Map,LayoutDashboard,PlusCircle,CalendarPlus,Search,Star, UserCircle, Home, UserPlus, LogIn, LogOut,Ticket } from "lucide-react";
import AuthContext from "../context/AuthContext";

export default function  Navbar(){
    const { userState, handleLogout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);

    const trips = useSelector((state) => state.trips.trips);
    const lastTrip = trips.length > 0 ? trips[trips.length - 1] : null;

    useEffect(() => {
        setUser(userState.user);

        if (userState?.isLoggedIn && location.pathname === "/login") {
            if (userState.user.role === "carOwner") {
                navigate("/car-owner-dashboard");
            } else if (userState.user.role === "traveller") {
                navigate("/traveller-dashboard");
            } else if (userState.user.role === "admin") {
                navigate("/admin-dashboard");
            }
        }
    }, [userState.isLoggedIn,location.pathname]);

    const logout = () => {
        handleLogout();
        navigate("/login");
    };

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                <div className="flex items-center">
                    <Car className="h-8 w-8 text-indigo-600" />
                    <span className="ml-2 text-xl font-bold text-gray-900">RideShare</span>
                </div>

                <div className="hidden md:flex items-center space-x-4">
                    {userState.isLoggedIn ? (
                        <>
                            {user?.role === "carOwner" && (
                                <>
                                    <Link to="/car-owner-dashboard" className="px-3 py-2 text-indigo-600 font-medium flex items-center">
                                        <LayoutDashboard className="w-4 h-4 mr-1" />
                                        Dashboard
                                    </Link>
                                    <Link to="/add-car" className="px-3 py-2 text-indigo-600 font-medium flex items-center">
                                        <PlusCircle className="w-4 h-4 mr-1" />
                                        Add Car
                                    </Link>
                                    <Link to="/create-trip" className="px-3 py-2 text-indigo-600 font-medium flex items-center">
                                        <CalendarPlus className="w-4 h-4 mr-1" />
                                        Create Trip
                                    </Link>
                                </>
                            )}
                            {user?.role === "traveller" && (
                                <>
                                    <Link to="/traveller-dashboard" className="px-3 py-2 text-indigo-600 font-medium flex items-center">
                                        <LayoutDashboard className="w-4 h-4 mr-1" />
                                        Dashboard
                                    </Link>
                                    <Link to="/search-trips" className="px-3 py-2 text-indigo-600 font-medium flex items-center">
                                        <Search className="w-4 h-4 mr-1" />
                                        Search Trips
                                    </Link>
                                    <Link to="/my-bookings" className="px-3 py-2 text-indigo-600 font-medium flex items-center">
                                        <Ticket className="w-4 h-4 mr-2" />
                                        My Bookings
                                    </Link>

                                    {lastTrip ? (
                                        <Link to={`/review/${lastTrip._id}`} className="px-3 py-2 text-indigo-600 font-medium flex items-center">
                                            <Star className="w-4 h-4 mr-1" />
                                            Reviews
                                        </Link>
                                    ) : (
                                        <span className="px-3 py-2 text-gray-400 font-medium flex items-center">
                                            <Star className="w-4 h-4 mr-1" />
                                            No Trips Yet
                                        </span>
                                    )}
                                    <Link to="/profile" className="px-3 py-2 text-indigo-600 font-medium flex items-center">
                                        <UserCircle className="w-4 h-4 mr-1" />
                                        Profile
                                    </Link>
                                </>
                            )}
                            {user?.role === "admin" && (
                                <>
                                    <Link to="/admin-dashboard" className="px-3 py-2 text-indigo-600 font-medium flex items-center">
                                        <LayoutDashboard className="w-4 h-4 mr-1" />
                                        Dashboard
                                    </Link>
                                    <Link to="/admin/users" className="px-3 py-2 text-indigo-600 font-medium flex items-center">
                                        <Users className="w-4 h-4 mr-1" />
                                        Users
                                    </Link>
                                    <Link to="/admin/approvals" className="px-3 py-2 text-indigo-600 font-medium flex items-center">
                                        <CheckSquare className="w-4 h-4 mr-1" />
                                        Approvals
                                    </Link>
                                    <Link to="/admin/cars" className="px-3 py-2 text-indigo-600 font-medium flex items-center">
                                        <CarFront className="w-4 h-4 mr-1" />
                                        Cars
                                    </Link>
                                    <Link to="/admin/trips" className="px-3 py-2 text-indigo-600 font-medium flex items-center">
                                        <Map className="w-4 h-4 mr-1" />
                                        Trips
                                    </Link>
                                </>
                            )}
                            <button onClick={logout} className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 flex items-center">
                                <LogOut className="w-4 h-4 mr-1" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/" className="px-3 py-2 text-indigo-600 font-medium flex items-center">
                                <Home className="w-4 h-4 mr-1" />
                                Home
                            </Link>
                            <Link to="/register" className="ml-2 px-4 py-2 border border-indigo-600 rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 flex items-center">
                                <UserPlus className="w-4 h-4 mr-1" />
                                Sign Up
                            </Link>
                            <Link to="/login" className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 flex items-center">
                                <LogIn className="w-4 h-4 mr-1" />
                                Sign In
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

