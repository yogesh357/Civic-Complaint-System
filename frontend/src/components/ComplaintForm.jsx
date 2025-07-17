import React, { useState } from 'react';
import { useGeolocation } from '../services/geolocation';

const ComplaintForm = ({ onSubmit }) => {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState('pothole');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [address, setAddress] = useState({
    street: '',
    area: '',
    landmark: '',
    city: '',
    pincode: ''
  });
  const { location, error: locationError, isLoading } = useGeolocation();

  const categories = [
    { label: "Pothole", value: "POTHOLE" },
    { label: "Water", value: "WATER" },
    { label: "Streetlight", value: "STREETLIGHT" },
    { label: "Garbage", value: "WASTE" },
    { label: "Other", value: "OTHER" },
    { label: "Sewage", value: "SEWAGE" },
  ];
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   if (!location && !address.street) {
  //     alert('Please provide a location for your complaint');
  //     return;
  //   }

  //   const complaint = {
  //     title,
  //     category,
  //     description,
  //     address: {  // Change from 'location' to 'address' to match backend
  //       street: address.street,
  //       area: address.area,
  //       city: address.city,
  //       pincode: address.pincode,
  //       landmark: address.landmark
  //     },
  //     image,
  //     timestamp: new Date().toISOString()
  //   };
  //   onSubmit(complaint);
  // };


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!location && !address.street) {
      alert('Please provide a location for your complaint');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('image', image);

    // Option 1: Send individual fields
    formData.append('address[street]', address.street);
    formData.append('address[area]', address.area);
    formData.append('address[landmark]', address.landmark);
    formData.append('address[city]', address.city);
    formData.append('address[pincode]', address.pincode);

    
    onSubmit(formData);
  };


  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 my-10">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Report an Issue</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Title*</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text" className='w-full p-5 mb-1   bg-gray-50 rounded-lg border border-gray-200 focus:ring-2  ' name="" />

          <label className="block text-gray-700 font-medium mb-2">Issue Type*</label>
          <select
            className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Description*</label>
          <textarea
            className="w-full p-3 h-32 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Please describe the issue in detail..."
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Upload Photo</label>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-100 cursor-pointer"
              >
                Choose File
              </label>
            </div>
            {previewImage && (
              <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">Max file size: 5MB</p>
        </div>

        {/* Location Section */}
        <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
          {/* <h3 className="text-lg font-medium text-gray-800 mb-4">Location Details*</h3>

          {isLoading ? (
            <div className="flex items-center text-blue-600">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Detecting your location...
            </div>
          ) : locationError ? (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
              ⚠️ {locationError}
            </div>
          ) : location && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
              ✅ Location detected: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </div>
          )} */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Street*</label>
              <input
                type="text"
                name="street"
                value={address.street}
                onChange={handleAddressChange}
                className="w-full p-3 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="Street name and number"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Area*</label>
              <input
                type="text"
                name="area"
                value={address.area}
                onChange={handleAddressChange}
                className="w-full p-3 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="Neighborhood or locality"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Landmark</label>
              <input
                type="text"
                name="landmark"
                value={address.landmark}
                onChange={handleAddressChange}
                className="w-full p-3 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nearby prominent location"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">City*</label>
              <input
                type="text"
                name="city"
                value={address.city}
                onChange={handleAddressChange}
                className="w-full p-3 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="City or town"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Pincode*</label>
              <input
                type="text"
                name="pincode"
                value={address.pincode}
                onChange={handleAddressChange}
                className="w-full p-3 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="Postal code"
                pattern="\d{6}"
                title="6-digit pincode"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-6 rounded-lg text-white font-semibold text-lg ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } transition duration-200 shadow-md`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : (
            'Submit Complaint'
          )}
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;