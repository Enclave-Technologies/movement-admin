"use client";
import React, { useMemo, useState } from 'react';

export default function Home() {
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

  const [modal , setModal] = useState(false)
  
  return (
    <div className='mt-2 ml-6'>
      <div className='flex flex-row justify-between items-center'>
        <div className='flex flex-col'>
          <h1 className='font-bold text-2xl'>Settings</h1>
          <p>Update your photo and personal details here</p>
        </div>
        <div className='flex flex-row space-x-2'>
          <button className='bg-white w-24 h-8 rounded-xl text-black'>Reset</button>
          <button className='bg-green-950 w-24 h-8 rounded-xl text-white'>Save</button>
        </div>
      </div>

      <div className='flex flex-col md:flex-row md:justify-between'>
        {/* Left div (Account Settings) */}
        <div className='border-2 border-gray-300 h-auto m-4 p-4 rounded-xl bg-white left-div space-y-4'>
          <h1 className='font-bold text-2xl ml-6'>Account Settings</h1>
          <p className='ml-6'>Profile Picture</p>
          <div className='flex justify-center'>
            <img className='w-24 h-24 rounded-full' src="images" alt="Profile" />
            <input type="file" capture="user" />
          </div>
          <div className='flex justify-center'>
            <button className='bg-green-950 w-36 h-8 rounded-xl text-white'>Edit Photo</button>
          </div>
          <input className='h-7 w-96 m-4 border-2 border-gray-300 rounded-xl' type="text" placeholder='Name' />
          <input className='h-7 w-96 m-4 border-2 border-gray-300 rounded-xl' type="email" placeholder='Email' />
          <input className='h-7 w-96 m-4 border-2 border-gray-300 rounded-xl' type="tel" placeholder='Phone' />
          <input className='h-7 w-96 m-4 border-2 border-gray-300 rounded-xl' type="text" placeholder='Personal Trainer | Body Transformation' />
        </div>

        {/* Right div (Password Settings) */}
        <div className='border-2 border-gray-300 h-auto m-4 p-4 rounded-xl bg-white right-div space-y-4 flex flex-col'>
          <h1 className='font-bold text-2xl ml-4'>Change Password</h1>
          <label className='ml-4' htmlFor="current-password">Current Password</label>
          <input className='h-7 w-96 m-4 border-2 border-gray-300 rounded-xl'
            type="password"
            placeholder='Current password'
          />
          <label className='ml-4' htmlFor="password">Password</label>
          <input className='h-7 w-96 m-4 border-2 border-gray-300 rounded-xl'
            id="password"
            type="password"
            value={form.password}
            placeholder='Password'
            onChange={(e) => {
              setForm({ ...form, password: e.target.value });
            }}
          />
          <label className='ml-4' htmlFor="confirm-password">Confirm Password</label>
          <input className='h-7 w-96 m-4 border-2 border-gray-300 rounded-xl'
            id="confirm-password"
            type="password"
            value={form.confirmPassword}
            placeholder='Confirm Password'
            onChange={(e) => {
              setForm({ ...form, confirmPassword: e.target.value });
            }}
          />
          <button  
            className={buttonState.bgcolor}
            disabled={buttonState.disabled}
          >
            Confirm Your Password
          </button>
        </div>
      </div>
    </div>
  );
}
