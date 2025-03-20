import AuthContext from "../context/AuthContext";
import { useReducer, useEffect } from "react";
import userReducer from "../reducers/UserReducer";
import axios from "axios";

const initialState = {
    isLoggedIn: false,
    user: null,
    loading : false
};

function AuthProvider({ children }) {
    const [userState, userDispatch] = useReducer(userReducer, initialState);
    const handleLogin = (data) => {
        console.log("Login Response:", data); 

        if (!data) {
            console.error("No token received in login response!");
            return;
        }

        localStorage.setItem("token", data.token);  
        console.log(localStorage.getItem('token'))
        localStorage.setItem("user", JSON.stringify({
            _id: data._id,
            name: data.name,
            email: data.email,
            role: data.role
        }));

        userDispatch({ type: "LOGIN", payload: { isLoggedIn: true, user: data } });
    };
    console.log(userState)

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.clear();
        userDispatch({ type: "LOGOUT", payload: { isLoggedIn: false, user: null } });
    };

    
    useEffect(() => {
        (async () => {
            const token = localStorage.getItem("token");
            console.log(token)
            if (!userState.isLoggedIn && token) {
                try {
                    const response = await axios.get("http://localhost:3040/api/users/account", {
                        headers: { Authorization: token }
                    });
                    console.log(response.data);
                    if (response.data) {
                        handleLogin(response.data.user)
                    }
                } catch (error) {
                    console.error("Error fetching user:", error.response?.data || error.message);
                    handleLogout();
                }
            }
            userDispatch({ type: "SET_LOADING", payload: false }); 
        })();
    }, [userState?.isLoggedIn]);

    if(userState.loading){
        return <p>...loading</p>
    }
    
    return (
        <AuthContext.Provider value={{ userState, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
