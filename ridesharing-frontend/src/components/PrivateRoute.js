import { Navigate } from "react-router-dom"; 
import AuthContext from "../context/AuthContext"; 
import { useContext } from "react"; 
 
export default function PrivateRoute({ children, permittedRoles, isPaymentPage }) { 
  const { userState } = useContext(AuthContext); 
 
  const token = localStorage.getItem("token"); 
  const userRole = userState?.user?.role; 
  console.log(userRole)
 
  if (!token) { 
    return <Navigate to="/login" replace />; 
  } 

  if (isPaymentPage) {
    return children;
  }

  
  if (permittedRoles && !permittedRoles.includes(userRole)) {
    return <Navigate to="/" replace />; 
  } 
 
  return children; 
}