import React from 'react'
import { useState,useEffect } from 'react'
import {useNavigate, BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import './index.css'
import { insert, getTests, login ,logout,getState} from './backend.jsx';
import Bar from './bar.jsx'
const Home=()=>{
    const navigate = useNavigate();
    
    const [user, setUser] = useState(null);
    
    const [message,setMessage]=useState(null)
    const urlParams = new URLSearchParams(window.location.search);
    

    useEffect(() => {
        if (user === null) {
            const temp = getState();
            if (temp === false) {
                const myParam = urlParams.get('signedIn');
                console.log(myParam)
                if (myParam!=null){
                  
                  setMessage('Please Sign In Before Using Services')
                  setTimeout(()=>setMessage(null),3000)
                  
                }
            } else {
                setUser(temp);
            }
        }
    }, [user, navigate]);
    
    return (
        <body class="bg-gray-100 font-sans">

          {/* Top Navigation Bar */}
          {message!=null&&<div className='	object-position: center top;'>{message}</div>}
          <Bar user={user}></Bar>



          {/* Existing Sections */}
          <section className="relative bg-blue-500 text-white">
            <div className="container mx-auto px-6 py-16 text-center">
              <h1 className="text-4xl font-bold mb-4">Welcome to TestForge</h1>
              <p className="text-xl mb-8">
                Your one-stop solution for all your educational needs. We provide
                top-notch practice tests and puzzles to help you achieve your goals.
              </p>
              {user===null&&
              <a href="/login" className="bg-yellow-500 text-gray-800 py-2 px-6 rounded hover:bg-yellow-400">
                Get Started
              </a>}
            </div>
          </section>
          <section className="relative bg-gray-200 text-lg py-20 px-8 text-black">
          <div className="flex flex-col items-center text-lg space-y-4">
              <div 
                className="cursor-pointer p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition ease-in-out duration-300"
                onClick={() => navigate('/guides')}
              >
                <p className="text-lg font-semibold text-gray-800 ">Guides</p>
                <p className="text-sm text-gray-600">Explore and generate comprehensive guides to enhance your skills.</p>
              </div>
              <div 
                className="cursor-pointer p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition ease-in-out duration-300"
                onClick={() => navigate('/puzzle')}
              >
                <p className="text-lg font-semibold text-gray-800">Daily Puzzle</p>
                <p className="text-sm text-gray-600">Challenge yourself with our daily puzzles and improve your problem-solving skills.</p>
              </div>
              <div 
                className="cursor-pointer p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition ease-in-out duration-300"
                onClick={() => navigate('/rush/main')}
              >
                <p className="text-lg font-semibold text-gray-800">Rush</p>
                <p className="text-sm text-gray-600">Test your speed and agility with our Rush mode challenges.</p>
              </div>
            </div>

          </section>
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-6 text-center">
              <h2 className="text-3xl font-bold mb-8">What Our Clients Say</h2>
              <div className="relative flex flex-wrap justify-center">
                <div className="w-full md:w-1/3 px-4 mb-8">
                  <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
                    <p className="text-gray-700 mb-4">
                      "I just signed up/looked at some of the new features.. looks super super cool. Really impressive how much progress you made"
                    </p>
                    <p className="font-semibold text-lg">Anonymous</p>
                    <p className="text-gray-500">Student</p>
                  </div>
                </div>
                <div className="w-full md:w-1/3 px-4 mb-8">
                  <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
                    <p className="text-gray-700 mb-4">
                      "Nice."
                    </p>
                    <p className="font-semibold text-lg">Jay B.</p>
                    <p className="text-gray-500">Student</p>
                  </div>
                </div>
                <div className="w-full md:w-1/3 px-4 mb-8">
                  <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
                    <p className="text-gray-700 mb-4">
                      "That's cool. Its like an AI version of my studier app."
                    </p>
                    <p className="font-semibold text-lg">Nv7</p>
                    <p className="text-gray-500">Web developer</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
      
          <section id="cta" className="bg-purple-300 text-white py-16 text-center">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl mb-8">
                Join us today and experience the best service tailored just for you.
              </p>
              {user===null&&<a href="/login" className="bg-yellow-500 text-gray-800 py-2 px-6 rounded hover:bg-yellow-400">
                Sign In Now
              </a>}
            </div>
          </section>
      
          <footer className="bg-gray-800 text-white py-6 text-center">
            <div className="container mx-auto px-6">
              <p>Thank you to William Feng, Nischant, and Dhruv Saini for helping me out. For any questions DM 'mamap' on Discord </p>
            </div>
          </footer>
        </body>
      )
      
   
}
export default Home