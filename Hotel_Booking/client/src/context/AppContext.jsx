import axios from "axios"
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY || "$";
    const navigate = useNavigate()
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || "");

    const getToken = () => token;

    const [searchedCities, setSearchedCities] = useState([])

    const [isOwner, setIsOwner] = useState(false);
    const [showHotelReg, setShowHotelReg] = useState(false);

    const login = (userData, userToken) => {
        setUser(userData);
        setToken(userToken);
        if (userData.role === "hotelOwner") {
            console.log("Owner Founed");

            setIsOwner("hotelOwner")
        } else {
            console.log("User Founed");
            setIsOwner("user")
        }
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setToken("");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const fetchUser = useCallback(async () => {
        if (!token) return;
        try {
            const { data } = await axios.get('/api/user', { headers: { Authorization: `Bearer ${token}` } })
            if (data.success) {
                console.log(data);

                if (data.role === "hotelOwner") {
                    console.log("Owner Founed");

                    setIsOwner("hotelOwner")
                } else {
                    console.log("User Founed");
                    setIsOwner("user")
                }
                setSearchedCities(data.recentSearchCity || [])
                setUser(JSON.parse(localStorage.getItem('user')));
            } else {
                logout();
            }
        } catch (error) {
            console.error(error);
            logout();
        }
    }, [token, navigate])

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser && token) {

            const parsedUser = JSON.parse(storedUser);
            console.log(parsedUser.role);
            setUser(parsedUser);
            if (parsedUser.role === "hotelOwner") {
                setIsOwner("hotelOwner")
            } else {
                setIsOwner("user")
            }
            fetchUser();

        }
    }, [token, fetchUser])

    const value = {
        currency, navigate, user, setUser, token, setToken, login, logout, getToken, isOwner, setIsOwner, axios, showHotelReg, setShowHotelReg, setSearchedCities, searchedCities
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext)
