import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import _ from "lodash";

export default function Login() {
    const { handleLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [clientErrors, setClientErrors] = useState(null);
    const [serverErrors, setServerErrors] = useState(null);
    const clientValidationErrors = {};

    const runClientValidations = () => {
        if (formData.email.trim().length === 0) {
            clientValidationErrors.email = "Email is required";
        }
        if (formData.password.trim().length === 0) {
            clientValidationErrors.password = "Password is required";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        runClientValidations();

        if (Object.keys(clientValidationErrors).length === 0) {
            try {
                const response = await axios.post("http://localhost:3040/api/users/login", formData);
                localStorage.setItem("token", response.data.token);
                console.log(localStorage.getItem('token'))
                

                const userResponse = await axios.get("http://localhost:3040/api/users/account", {
                    headers: { Authorization: localStorage.getItem("token") },
                });

                const user = _.pick(userResponse.data.user, ["_id", "email", "role", "name"]);
                console.log(response.data)
                handleLogin({ ...user, token:response.data.token});
                
            } catch (err) {
                setServerErrors(err.response?.data?.errors || "Something went wrong");
            }
            setClientErrors({});
        } else {
            setClientErrors(clientValidationErrors);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg flex w-3/4 max-w-4xl overflow-hidden">
               
                <div className="w-1/2 p-8 bg-blue-50">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">WELCOME</h2>

                    {serverErrors && (
                        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
                            <b>{serverErrors}</b>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        <div>
                            <label htmlFor="email" className="block text-gray-700 font-semibold">Username</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Username"
                            />
                            {clientErrors?.email && <p className="text-red-500 text-sm mt-1">{clientErrors.email}</p>}
                        </div>

                        
                        <div>
                            <label htmlFor="password" className="block text-gray-700 font-semibold">Password</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Password"
                            />
                            {clientErrors?.password && <p className="text-red-500 text-sm mt-1">{clientErrors.password}</p>}
                        </div>

                       
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold"
                        >
                            SUBMIT
                        </button>
                        <div className="text-center text-gray-600 text-sm mt-4">
                             Don't have an account? 
                            <button 
                                type="button" 
                                onClick={() => navigate("/register")}
                                className="text-indigo-600 hover:text-indigo-800 ml-1 font-medium"
                            >
                                Register here
                            </button>
                        </div>
                    </form>
                </div>

                
                <div className="w-1/2 flex items-center justify-center p-8 bg-gray-100">
                    <img src="https://storage.googleapis.com/a1aa/image/qNXoq_IUUP1oDuOJ8ijKhrOgu5t-JnZJagZEg9JQlIc.jpg" alt="Login Illustration" className="w-3/4" />
                </div>
            </div>
        </div>
    );
}
