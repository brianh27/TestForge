import React from 'react'
import { useState,useEffect } from 'react'
import {useNavigate, BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import './index.css'
import { insert, getTests, login ,logout,getState} from './backend.jsx';
const Bar=({user})=>{
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
        console.log(isDropdownOpen)
    };
    const navigate = useNavigate();
    console.log(user)
    return(
        <nav className="bg-gray-800 text-white py-4 relative">
            <div className="container mx-auto px-6 flex justify-between items-center">
              <div onClick={()=>navigate('/')} className="text-lg font-bold hover:text-white mx-4 cursor-pointer">TestForge</div>
              <div className="relative">
              
              <a onClick={() => navigate('/guides')} className="text-gray-300 hover:text-white mx-4 cursor-pointer">Guides</a>
              <a onClick={() => navigate('/puzzle')} className="text-gray-300 hover:text-white mx-4 cursor-pointer">Puzzles</a>
              <a onClick={() => navigate('/rush/main')} className="text-gray-300 hover:text-white mx-4 cursor-pointer">Rush</a>
                <a href='https://discord.gg/UQbMpFyrPh' target="_blank" className="text-gray-300 hover:text-white mx-4 cursor-pointer">Join the Discord</a>
                <a 
                  onClick={() => user === null ? navigate('/login') : toggleDropdown()} 
                  className="text-gray-300 hover:text-white mx-4 cursor-pointer"
                >
                  
                  {user === null ? "Sign in" : user.username}
                </a>
                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                    <button
                      className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                      onClick={() => {logout({ nav: navigate }); window.location.reload();}}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </nav>
    )
}
export default Bar
