"use client";
import React, { useMemo, useState } from 'react';

export default function Home() {
  const MyModal = ({ show, onClose, image, setImage }) => {
    if (!show) return null;

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const imgUrl = URL.createObjectURL(file);
        setImage(imgUrl);
      }
    };

    return (
      <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
        <div className='bg-white h-64 w-96 p-6 rounded-lg shadow-lg'>
          <h2 className='text-xl font-bold text-center mb-4'>Edit Photo</h2>
          {image && (
            <div className='flex justify-center mb-4'>
              <img src={image} alt="Selected" className="h-24 w-24 rounded-full" />
            </div>
          )}
          <div className='flex justify-around mb-4'> {/* Use justify-around to space buttons side by side */}
            <button 
              className="bg-[#006847] text-white p-2 rounded-xl w-36" 
              onClick={() => document.getElementById('file-input').click()}
            >
              Upload Photo
            </button>
            <button 
              className="bg-[#006847] text-white p-2 rounded-xl w-36" 
              onClick={() => document.getElementById('camera-input').click()}
            >
              Use Camera
            </button>
          </div>
          <input
            type="file"
            id="file-input"
            accept="image/*"
            style={{ display: 'none' }} // Hide input
            onChange={handleFileChange}
          />
          <input
            type="file"
            id="camera-input"
            accept="image/*"
            capture="environment" // Opens the camera directly
            style={{ display: 'none' }} // Hide input
            onChange={handleFileChange}
          />
          <div className='flex justify-end mt-4'>
            <button className="bg-gray-300 text-black p-2 rounded-xl w-24" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const [form, setForm] = useState({
    password: "",
    confirmPassword: ""
  });

  const buttonState = useMemo(() => {
    if (form.password === "" || form.confirmPassword === "") {
      return {
        bgcolor: "bg-state-500",
        disabled: true,
      };
    } else if (form.password !== form.confirmPassword) {
      return {
        bgcolor: "bg-red-400",
        disabled: true,
      };
    } else {
      return {
        bgcolor: "bg-green-900",
        disabled: false,
      };
    }
  }, [form]);

  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState(null); // State to hold the selected image

  return (
    <div className='mt-2 ml-6'>
      <div className='flex flex-row justify-between items-center'>
        <div className='flex flex-col'>
          <h1 className='font-bold text-2xl'>Settings</h1>
          <p>Update your photo and personal details here</p>
        </div>
        <div className='flex flex-row space-x-2'>
          <button className='bg-white w-24 h-8 rounded-xl text-black'>Reset</button>
          <button className='bg-[#006847] w-24 h-8 rounded-xl text-white'>Save</button>
        </div>
      </div>

      <div className='flex flex-col md:flex-row md:justify-between'>
        {/* Left div (Account Settings) */}
        <div className='border-2 border-gray-300 h-auto m-4 p-4 rounded-xl bg-white left-div space-y-4'>
          <h1 className='font-bold text-2xl ml-6'>Account Settings</h1>
          <p className='ml-6'>Profile Picture</p>
          <div className='flex justify-center'>
            <img className='w-24 h-24 rounded-full' src={image || "default-image-url"} alt="Profile" />
          </div>
          <div className='flex justify-center'>
            <button className='bg-[#006847] w-36 h-8 rounded-xl text-white' onClick={() => setShowModal(true)}>Edit Photo</button>
          </div>
          <div className='ml-6'>
            <label className='block ml-4' htmlFor="name">Name</label>
            <input className='h-7 w-96 m-4 border-2 border-gray-300 rounded-xl' type="text" placeholder='Name' />
            <label className='block ml-4' htmlFor="email">Email</label>
            <input className='h-7 w-96 m-4 border-2 border-gray-300 rounded-xl' type="email" placeholder='Email' />
            <label className='block ml-4' htmlFor="phone">Phone</label>
            <input className='h-7 w-96 m-4 border-2 border-gray-300 rounded-xl' type="tel" placeholder='Phone' />
            <input className='h-7 w-96 m-4 border-2 border-gray-300 rounded-xl' type="text" placeholder='Personal Trainer | Body Transformation' />
          </div>
        </div>

        {/* Right div (Password Settings) */}
        <div className='border-2 border-gray-300 h-auto m-4 p-4 rounded-xl bg-white right-div space-y-4 flex flex-col'>
          <h1 className='font-bold text-2xl ml-4'>Change Password</h1>
          <label className='ml-4' htmlFor="current-password">Current Password</label>
          <input className='h-7 w-96 m-4 border-2 border-gray-300 rounded-xl' type="password" placeholder='Current password' />
          <label className='ml-4' htmlFor="password">Password</label>
          <input className='h-7 w-96 m-4 border-2 border-gray-300 rounded-xl' id="password" type="password" value={form.password} placeholder='Password' onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <label className='ml-4' htmlFor="confirm-password">Confirm Password</label>
          <input className='h-7 w-96 m-4 border-2 border-gray-300 rounded-xl focus:border-blue-500' id="confirm-password" type="password" value={form.confirmPassword} placeholder='Confirm Password' onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
          <button className={`h-8 w-96 rounded-xl text-white ${buttonState.bgcolor} border-2 border-gray-300`} disabled={buttonState.disabled}>
            Confirm Your Password
          </button>
        </div>
      </div>

      <MyModal show={showModal} onClose={() => setShowModal(false)} image={image} setImage={setImage} />
    </div>
  );
}
