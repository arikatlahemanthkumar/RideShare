import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: ""
    });

    const [clientErrors, setClientErrors] = useState(null);
    const [serverErrors, setServerErrors] = useState(null);
    const clientValidationErrors = {};

    const runClientValidations = () => {
        if (formData.name.trim().length === 0) {
            clientValidationErrors.name = "Name is required";
        }
        if (formData.password.trim().length === 0) {
            clientValidationErrors.password = "Password is required";
        }
        if (formData.email.trim().length === 0) {
            clientValidationErrors.email = "Email is required";
        }
        if (formData.role.trim().length === 0) {
            clientValidationErrors.role = "Role is required";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        runClientValidations();
        if (Object.keys(clientValidationErrors).length === 0) {
            try {
                await axios.post("http://localhost:3040/api/users/register", formData);
                navigate("/login");
            } catch (err) {
                setServerErrors(err.response?.data?.errors || ["Something went wrong"]);
                console.log(err.response?.data?.errors);
            }
            setClientErrors({});
        } else {
            setClientErrors(clientValidationErrors);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="flex w-full max-w-5xl shadow-lg rounded-lg overflow-hidden">
                
                <div className="w-1/2 bg-indigo-50 flex items-center justify-center p-6">
                    <img 
                        src="/images/taxi-image.jpg" 
                        alt="Taxi Service Illustration" 
                        className="max-w-full h-auto"
                    />
                </div>
                
                
                <div className="w-1/2 bg-white p-8">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Register</h2>

                    {serverErrors && (
                        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
                            <h3 className="font-semibold">Server Errors</h3>
                            <ul className="list-disc list-inside">
                                {serverErrors.map((ele, i) => (
                                    <li key={i}>{ele.msg}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-gray-700 font-medium">Enter Name:</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {clientErrors?.name && <p className="text-red-500 text-sm mt-1">{clientErrors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-gray-700 font-medium">Enter Email:</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {clientErrors?.email && <p className="text-red-500 text-sm mt-1">{clientErrors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-gray-700 font-medium">Enter Password:</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {clientErrors?.password && <p className="text-red-500 text-sm mt-1">{clientErrors.password}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Role</label>
                            <div className="flex items-center space-x-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="carOwner"
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="form-radio text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="ml-2 text-gray-700">Car Owner</span>
                                </label>

                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="traveller"
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="form-radio text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="ml-2 text-gray-700">Traveller</span>
                                </label>
                            </div>
                            {clientErrors?.role && <p className="text-red-500 text-sm mt-1">{clientErrors.role}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
                        >
                            Register
                        </button>
                        
                        <div className="text-center text-gray-600 text-sm mt-4">
                            Already have an account? 
                            <button 
                                type="button" 
                                onClick={() => navigate("/login")}
                                className="text-indigo-600 hover:text-indigo-800 ml-1 font-medium"
                            >
                                Login here
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}