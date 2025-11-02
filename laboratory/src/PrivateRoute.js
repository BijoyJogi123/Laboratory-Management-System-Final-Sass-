import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';

function PrivateRoute({ children }) {

    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const location = useLocation(); // Get current location (the page the user is trying to access)

    useEffect(() => {
        const checkAuthentication = () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    setIsAuthenticated(false);
                    return;
                }

                // Decode JWT token to check if it's expired
                const tokenPayload = JSON.parse(atob(token.split('.')[1]));
                const currentTime = Date.now() / 1000;

                if (tokenPayload.exp < currentTime) {
                    // Token is expired
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                } else {
                    // Token is valid
                    setIsAuthenticated(true);
                }
            } catch (error) {
                // Invalid token format or other errors
                localStorage.removeItem('token');
                setIsAuthenticated(false);
            }
        };

        checkAuthentication();
    }, []);

    // Show a loading state while checking authentication
    if (isAuthenticated === null) {
        return <div>
            
            <main
                id="mainContent"
                className={`transition-all duration-300 `}
                
            >
                <LoadingSpinner />
            </main>
        </div>;

    }

    // If authenticated, render the protected content
    if (isAuthenticated) {
        return children;
    }

    // If not authenticated, redirect to the login page and save the current page in the 'state'
    return <Navigate to="/login" state={{ from: location }} />;
};


export default PrivateRoute
