import axios from "axios"
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY || "$";
    const navigate = useNavigate()
    const user = null; // Removed Clerk useUser
    const getToken = () => ""; // Removed Clerk useAuth

    const [searchedCities, setSearchedCities] = useState([])

    const [isOwner, setIsOwner] = useState(false);
    const [showHotelReg, setShowHotelReg] = useState(false);

    const fetchUser = useCallback(async () => {
        try {
            const { data } = await axios.get('/api/user', { headers: { Authorization: `Bearer ${await getToken()}` } })
            if (data.success) {
                setIsOwner(data.role === "hotelOwner");
                setSearchedCities(data.recentSearchedCities)
            } else {
                setTimeout(() => {
                    fetchUser()
                }, 5000)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }, [getToken])

    useEffect(() => {
        if (user) {
            fetchUser();
        }
    }, [user, fetchUser])

    const value = {
        currency, navigate, user, getToken, isOwner, setIsOwner, axios, showHotelReg, setShowHotelReg, setSearchedCities, searchedCities
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext)
