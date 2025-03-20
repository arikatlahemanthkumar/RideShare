import { useState, useContext, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { updateTravellerProfile, getTravellerProfile } from "../../redux/slices/traveller-slice";
import {toast} from "react-toastify"


export default function TravellerProfile() {
    const dispatch = useDispatch();
    const { userState } = useContext(AuthContext);
    const { user } = userState;
    
    
    const { data, profile, loading } = useSelector((state) => state.traveller);
    
    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        mobileNumber: "",
        address: "",
        emergencyContact: "",
        gender: "",
        aadharCard: null,
        profileImage: null,
        aadharCardUrl: "",
        profileImageUrl: ""
    });

    console.log(formData)   

    
    useEffect(() => {
        console.log(user)
        if (user && user._id) {
            dispatch(getTravellerProfile(user._id));
        }
    }, [dispatch, user]);

   useEffect(() => {
    if (profile && Object.keys(profile).length > 0) {
        setFormData({
            name: profile.name || "",
            mobileNumber: profile.mobileNumber || "",
            address: profile.address || "",
            emergencyContact: profile.emergencyContact || "",
            gender: profile.gender || "",
            profileImageUrl: profile.profileImage || "",
            aadharCardUrl: profile.aadharCard || ""
        });

        if (profile.profileImage) {
            setPreviewImage(profile.profileImage);
        }
    } else if (data && Object.keys(data).length > 0) {
        setFormData({
            name: data.name || "",
            mobileNumber: data.mobileNumber || "",
            address: data.address || "",
            emergencyContact: data.emergencyContact || "",
            gender: data.gender || "",
            profileImageUrl: data.profileImage || "",
            aadharCardUrl: data.aadharCard || ""
        });

        if (data.profileImage) {
            setPreviewImage(data.profileImage);
        }
    } else if (user) {
        setFormData({
            name: user.name || "",
            mobileNumber: user.mobileNumber || "",
            address: user.address || "",
            emergencyContact: user.emergencyContact || "",
            gender: user.gender || "",
            profileImageUrl: user.profileImage || "",
            aadharCardUrl: user.aadharCard || ""
        });

        if (user.profileImage) {
            setPreviewImage(user.profileImage);
        }
    }
}, [profile, data, user]);

useEffect(() => {
    console.log("Profile Data from Redux: ", profile);
    console.log("Data from Redux: ", data);
}, [profile, data]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            setFormData({ ...formData, [name]: files[0] });

            if (name === "profileImage") {
                setPreviewImage(URL.createObjectURL(files[0]));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        

        try {
            const newFormData = new FormData();
            newFormData.append("name", formData.name);
            newFormData.append("mobileNumber", formData.mobileNumber);
            newFormData.append("emergencyContact", formData.emergencyContact);
            newFormData.append("address", formData.address);
            newFormData.append("gender", formData.gender);

            if (formData.profileImage) newFormData.append("profileImage", formData.profileImage);
            if (formData.aadharCard) newFormData.append("aadharCard", formData.aadharCard);

            
            await dispatch(updateTravellerProfile({ id: user?._id, formData: newFormData }));
            dispatch(getTravellerProfile(user._id));

            setIsEditing(false);
            toast.success("Profile updated successfully!");

        } catch (err) {
            console.log(err);
            toast.error("Failed to update profile. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    
    if (loading) {
        return <div className="max-w-4xl mx-auto p-6 text-center">Loading profile data...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            
            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white flex justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-white text-4xl overflow-hidden">
                                {previewImage ? (
                                    <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span>{formData.name ? formData.name.charAt(0).toUpperCase() : "U"}</span>
                                )}
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{formData.name || "Traveller Profile"}</h1>
                            <p className="text-blue-100">Manage your personal information</p>
                        </div>
                    </div>
                    {!isEditing && (
                        <button
                        className="bg-white text-blue-600 px-4 py-0.5 rounded-lg font-medium shadow-md text-sm"
                        onClick={() => setIsEditing(true)}
                    >
                        Edit
                    </button>
                    )}
                </div>

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                                <input
                                    type="tel"
                                    name="mobileNumber"
                                    value={formData.mobileNumber}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Contact</label>
                            <input
                                type="tel"
                                name="emergencyContact"
                                value={formData.emergencyContact}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                required
                            />
                        </div>

                        <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Gender
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                            {["male", "female", "rather not to say"].map((option) => (
                                <label
                                    key={option}
                                    className={`flex items-center justify-center px-4 py-2 rounded-lg border cursor-pointer transition-colors ${
                                        formData.gender === option
                                            ? "bg-blue-50 border-blue-500 text-blue-700"
                                            : "border-gray-300 hover:bg-gray-50"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="gender"
                                        value={option}
                                        onChange={handleChange}
                                        checked={formData.gender === option}
                                        className="hidden"
                                        required
                                    />
                                    <span className="capitalize">
                                        {option === "rather not to say" ? "Prefer not to say" : option}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Aadhar Card
                        </label>
                        <div className="flex items-center justify-center w-full">
                            <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-blue-500 transition-colors">
                                <span className="text-sm text-gray-500">
                                    {formData.aadharCard
                                        ? `Selected: ${formData.aadharCard.name}`
                                        : formData.aadharCardUrl
                                        ? "Aadhar Card Uploaded (Click to change)"
                                        : "Click to upload Aadhar Card"}
                                </span>
                                <input
                                    type="file"
                                    name="aadharCard"
                                    onChange={handleFileChange}
                                    accept="image/*,application/pdf"
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                  

                        <button type="submit" className="py-3 px-6 bg-blue-600 text-white rounded-lg">
                            {isLoading ? "Updating..." : "Save Changes"}
                        </button>
                    </form>
                ) : (
                    <div className="p-6 space-y-4">
                        <p><strong>Name:</strong> {formData.name}</p>
                        <p><strong>Mobile:</strong> {formData.mobileNumber}</p>
                        <p><strong>Address:</strong> {formData.address}</p>
                        <p><strong>Emergency Contact:</strong> {formData.emergencyContact}</p>
                        <p><strong>Gender:</strong> {formData.gender}</p>
                        
                        {formData.aadharCardUrl && (
                            <p><strong>Aadhar Card:</strong> Uploaded</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}