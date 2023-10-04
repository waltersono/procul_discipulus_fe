import Router from './routes';
import './App.css';
import { AuthProvider } from './contexts/auth';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
    return(
        <AuthProvider>
            <Router />
            <ToastContainer/>
        </AuthProvider>
    )
}

export default App;
