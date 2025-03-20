import React, { useContext } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import { Car, Users, MapPin, Shield, Star, DollarSign, Leaf } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const HomePage = () => {
  const {userState} = useContext(AuthContext)
  const navigate = useNavigate()

  const handleNavigation = (path)=>{
    if(!userState.isLoggedIn){
      navigate('/login')
    }else{
      navigate(path)
    }
  }
  return (
    <div className="min-h-screen bg-white">

      <div className="relative bg-indigo-800 text-center py-32 px-6 text-white">
        <h1 className="text-4xl font-extrabold">Share Your Ride, Share Your Fun 🤝 </h1>
        <p className="mt-4 text-xl">"Travel Smart, Connect More People, Beat The Traffic!"</p>
        <div className="mt-6 flex justify-center space-x-4">
          <Link to="/search-trips" className="px-5 py-3 bg-white text-indigo-700 rounded-md font-medium">Find a Ride</Link>
          <Link to="/create-trip" className="px-5 py-3 bg-indigo-600 text-white rounded-md font-medium">Offer a Ride</Link>
        </div>
      </div>

     
      <div className="py-16 bg-gray-50 text-center">
        <h2 className="text-3xl font-extrabold">How RideShare Works</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { icon: MapPin, title: "Search for a Ride", desc: "Find rides by entering your location and destination." },
            { icon: Users, title: "Book Your Seat", desc: "Select a ride and complete your booking securely." },
            { icon: Car, title: "Enjoy Your Journey", desc: "Meet your driver, track the ride, and travel comfortably." }
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium">{title}</h3>
              <p className="mt-2 text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      
      <div className="py-16 bg-white text-center">
        <h2 className="text-3xl font-extrabold">Why Choose RideShare?</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            { icon: Shield, title: "Safe & Secure", desc: "Verified drivers, secure payments, and trusted community." },
            { icon: Star, title: "Highly Rated", desc: "Reviewed rides ensure quality experiences for everyone." },
            { icon: DollarSign, title: "Affordable Travel", desc: "Save money by sharing rides with verified drivers." },
            { icon: Leaf, title: "Eco-Friendly", desc: "Reduce carbon footprint and contribute to sustainability." }
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-gray-50 p-6 rounded-lg shadow-md text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium">{title}</h3>
              <p className="mt-2 text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;