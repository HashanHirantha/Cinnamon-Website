// Register route now redirects to the unified /login page (which includes sign-up mode)
import { Navigate } from 'react-router-dom';
const Register = () => <Navigate to="/login" replace />;
export default Register;
