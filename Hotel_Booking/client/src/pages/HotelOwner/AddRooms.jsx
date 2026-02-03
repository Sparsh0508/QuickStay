import React, { useState } from 'react';
import Title from '../../components/Title';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AddRoom = () => {
    const { axios, getToken } = useAppContext();

    const [images, setImages] = useState({
        1: null,
        2: null,
        3: null,
        4: null,
    });

    const [inputs, setInputs] = useState({
        roomType: '',
        pricePerNight: '',
        amenities: {
            'Free Wifi': false,
            'Free Breakfast': false,
            'Room Service': false,
            'Mountain View': false,
            'Pool Access': false,
            'Air Conditioning': false,
            'Mini Bar': false,
        },
    });

    const [loading, setLoading] = useState(false);

    const roomCreateHandler = async (e) => {
        e.preventDefault();

        if (
            !inputs.roomType ||
            !inputs.pricePerNight ||
            inputs.pricePerNight <= 0 ||
            !Object.values(images).some((img) => img)
        ) {
            toast.error('Please fill all required fields correctly (at least one image and valid price)');
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('roomType', inputs.roomType);
            formData.append('pricePerNight', inputs.pricePerNight);

            const amenities = Object.keys(inputs.amenities).filter(
                (key) => inputs.amenities[key]
            );
            formData.append('amenities', JSON.stringify(amenities));

            Object.keys(images).forEach((key) => {
                if (images[key]) {
                    formData.append('images', images[key]);
                }
            });

            const { data } = await axios.post(
                '/api/rooms',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${await getToken()}`,
                    },
                }
            );

            if (data.success) {
                toast.success(data.message);

                setInputs({
                    roomType: '',
                    pricePerNight: '',
                    amenities: {
                        'Free Wifi': false,
                        'Free Breakfast': false,
                        'Room Service': false,
                        'Mountain View': false,
                        'Pool Access': false,
                        'Air Conditioning': false,
                        'Mini Bar': false,
                    },
                });

                setImages({
                    1: null,
                    2: null,
                    3: null,
                    4: null,
                });
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={roomCreateHandler} className="max-w-4xl">
            <Title
                align="left"
                font="outfit"
                title="Add Room"
                subTitle="Fill in the details carefully to enhance the user booking experience"
            />

            {/* Images */}
            <div className="mt-8">
                <p className="text-gray-700 font-medium mb-3">Room Images (Max 4)</p>
                <div className="flex gap-4 flex-wrap">
                    {Object.keys(images).map((key) => (
                        <label htmlFor={`roomImage${key}`} key={key} className="relative group">
                            <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors overflow-hidden">
                                {images[key] ? (
                                    <img
                                        className="w-full h-full object-cover"
                                        src={URL.createObjectURL(images[key])}
                                        alt="Preview"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <img className="w-8 opacity-40" src={assets.uploadArea} alt="Upload" />
                                        <span className="text-[10px] text-gray-400 mt-1">Upload</span>
                                    </div>
                                )}
                            </div>
                            <input
                                accept="image/*"
                                type="file"
                                id={`roomImage${key}`}
                                hidden
                                onChange={(e) =>
                                    setImages({
                                        ...images,
                                        [key]: e.target.files[0],
                                    })
                                }
                            />
                            {images[key] && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setImages({ ...images, [key]: null });
                                    }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    ×
                                </button>
                            )}
                        </label>
                    ))}
                </div>
            </div>

            {/* Room Type & Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div>
                    <p className="text-gray-700 font-medium mb-2">Room Type</p>
                    <select
                        value={inputs.roomType}
                        required
                        onChange={(e) =>
                            setInputs({ ...inputs, roomType: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Select Room Type</option>
                        <option value="Single Bed">Single Bed</option>
                        <option value="Double Bed">Double Bed</option>
                        <option value="Luxury Room">Luxury Room</option>
                        <option value="Family Suite">Family Suite</option>
                        <option value="Studio Apartment">Studio Apartment</option>
                    </select>
                </div>

                <div>
                    <p className="text-gray-700 font-medium mb-2">
                        Price <span className="text-sm font-normal text-gray-500">(per night)</span>
                    </p>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                            type="number"
                            required
                            min="1"
                            placeholder="0"
                            className="w-full border border-gray-300 rounded-lg p-3 pl-8 outline-none focus:ring-2 focus:ring-indigo-500"
                            value={inputs.pricePerNight}
                            onChange={(e) =>
                                setInputs({
                                    ...inputs,
                                    pricePerNight: e.target.value,
                                })
                            }
                        />
                    </div>
                </div>
            </div>

            {/* Amenities */}
            <div className="mt-8">
                <p className="text-gray-700 font-medium mb-3">Amenities</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 bg-gray-50 p-6 rounded-xl">
                    {Object.keys(inputs.amenities).map((amenity) => (
                        <div
                            key={amenity}
                            className="flex items-center gap-3 cursor-pointer group"
                            onClick={() =>
                                setInputs({
                                    ...inputs,
                                    amenities: {
                                        ...inputs.amenities,
                                        [amenity]: !inputs.amenities[amenity],
                                    },
                                })
                            }
                        >
                            <input
                                type="checkbox"
                                readOnly
                                checked={inputs.amenities[amenity]}
                                className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                            <span className="text-gray-700 group-hover:text-indigo-600 transition-colors">
                                {amenity}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-4 rounded-xl mt-10 font-semibold shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
            >
                {loading ? (
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Adding Room...
                    </div>
                ) : (
                    'Create Room Listing'
                )}
            </button>
        </form>
    );
};

export default AddRoom;
