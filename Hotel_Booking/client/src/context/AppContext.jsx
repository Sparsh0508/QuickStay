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
                setIsOwner(data.role === "hotelOwner");
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
            setUser(JSON.parse(storedUser));
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
