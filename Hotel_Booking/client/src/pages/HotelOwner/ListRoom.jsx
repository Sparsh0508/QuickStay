import React, { useEffect, useState, useCallback } from "react";
import Title from "../../components/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ListRoom = () => {
  const { axios, getToken } = useAppContext();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/rooms/owner', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });
      if (data.success) {
        setRooms(data.rooms);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [axios, getToken]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const toggleAvailability = async (roomId) => {
    try {
      const { data } = await axios.post('/api/rooms/toggle-availability',
        { roomId },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      if (data.success) {
        toast.success(data.message);
        fetchRooms();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteRoom = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      const { data } = await axios.delete(`/api/rooms/${id}`, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });
      if (data.success) {
        toast.success(data.message);
        setRooms(prev => prev.filter(room => room._id !== id));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-6xl">
      <Title
        align="left"
        font="outfit"
        title="Room Listings"
        subTitle="Manage your properties and keep availability up to date"
      />

      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="py-4 px-6 text-gray-500 font-medium text-sm">Room Image</th>
                <th className="py-4 px-6 text-gray-500 font-medium text-sm">Room Details</th>
                <th className="py-4 px-6 text-gray-500 font-medium text-sm">Price</th>
                <th className="py-4 px-6 text-gray-500 font-medium text-sm text-center">Availability</th>
                <th className="py-4 px-6 text-gray-500 font-medium text-sm text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading your rooms...</span>
                    </div>
                  </td>
                </tr>
              ) : rooms.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center text-gray-400">
                    No rooms found. Start by adding one!
                  </td>
                </tr>
              ) : rooms.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <img
                      src={item.images[0]}
                      alt=""
                      className="w-20 h-14 object-cover rounded-lg shadow-sm"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-gray-800">{item.roomType}</div>
                    <div className="text-xs text-gray-400 mt-1 flex flex-wrap gap-1">
                      {item.amenities.slice(0, 3).join(" • ")}
                      {item.amenities.length > 3 && ` +${item.amenities.length - 3} more`}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-700 font-medium">
                    ${item.pricePerNight} <span className="text-[10px] text-gray-400">/night</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-center">
                      <label className='relative inline-flex items-center cursor-pointer'>
                        <input
                          type="checkbox"
                          className='sr-only peer'
                          checked={item.isAvailable}
                          onChange={() => toggleAvailability(item._id)}
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600 transition-colors duration-200"></div>
                        <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5 shadow-sm"></span>
                      </label>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => deleteRoom(item._id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                      title="Delete Room"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListRoom;
