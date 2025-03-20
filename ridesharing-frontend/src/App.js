import "./index.css";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import TravellerDashboard from "./pages/dashboard/TravellerDashboard";
import CarOwnerDashboard from "./pages/dashboard/CarOwnerDashboard";
import TravellerProfile from "./pages/profile/TravellerProfile";
import AddCar from "./pages/car-owner/AddCar";
import CreateTrip from "./pages/trips/CreateTrip";
import SearchTrips from "./pages/traveller/SearchTrips";
import BookingConfirmation from "./pages/booking/BookingConfirmation";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ReviewForm from "./pages/reviews/ReviewForm";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminApprovals from "./pages/admin/AdminApprovals";
import AdminCars from "./pages/admin/AdminCars";
import AdminTrips from "./pages/admin/AdminTrips";
import MyBookings from "./pages/booking/MyBookings";
import PaymentRejectedPage from "./pages/payment/PaymentRejectedPage";
import PaymentSuccess from "./pages/payment/PaymentSuccessPage";



export default function App() {

  return (
    <div className="App">
      <Navbar />
      <ToastContainer autoClose={2000} />
      <Routes>


        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Car Owner Routes */}
        <Route
          path="/car-owner-dashboard"
          element={
            <PrivateRoute role="carOwner">
              <CarOwnerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-car"
          element={
            <PrivateRoute role="carOwner">
              <AddCar />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-trip"
          element={
            <PrivateRoute role="carOwner">
              <CreateTrip />
            </PrivateRoute>
          }
        />

        {/* Traveller Routes */}
        <Route
          path="/traveller-dashboard"
          element={
            <PrivateRoute role="traveller">
              <TravellerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute role="traveller">
              <TravellerProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/search-trips"
          element={
            <PrivateRoute role="traveller">
              <SearchTrips />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <PrivateRoute role="traveller">
              <MyBookings />
            </PrivateRoute>
          }

        />
        <Route
          path="/booking-confirmation"
          element={
            <PrivateRoute role="traveller">
              <BookingConfirmation />
            </PrivateRoute>
          }

        />

        <Route
          path="/payment-rejected"
          element={
            <PrivateRoute role="traveller">
              <PaymentRejectedPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/payment-success"
          element={
            <PrivateRoute role="traveller" isPaymentPage={true}>
              <PaymentSuccess />
            </PrivateRoute>
          }
        />


        <Route
          path="/review/:tripId"
          element={
            <PrivateRoute role="traveller">
              <ReviewForm />
            </PrivateRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }

        />
        <Route
          path="/admin/users"
          element={
            <PrivateRoute role="admin">
              <AdminUsers />
            </PrivateRoute>
          } />
        <Route
          path="/admin/approvals"
          element={
            <PrivateRoute role="admin">
              <AdminApprovals />
            </PrivateRoute>
          } />
        <Route
          path="/admin/cars"
          element={
            <PrivateRoute>
              <AdminCars />
            </PrivateRoute>
          } />
        <Route
          path="/admin/trips"
          element={
            <PrivateRoute>
              <AdminTrips />
            </PrivateRoute>
          } />

      </Routes>
    </div>
  );
}
