import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getState, logout } from './backend';
import './index.css';

const Home = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        if (user === null) {
            const temp = getState();
            if (temp === false) {
                navigate('/home?signedIn=0');
            } else {
                setUser(temp);
            }
        }
    }, [user, navigate]);

    console.log(user);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center relative">
            <h1 className="text-3xl font-bold mb-8">
                Welcome to TestForge!
            </h1>
            
            <div className="space-y-4">
                <button 
                    className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
                    onClick={() => navigate(`/guides`)}
                >
                    Study Guide Generator
                </button>

                <button 
                    className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 transition duration-300"
                    onClick={() => navigate(`/puzzle`)}
                >
                    Daily Puzzle
                </button>

                <button 
                    className="bg-purple-500 text-white font-semibold py-2 px-4 rounded hover:bg-purple-700 transition duration-300"
                    onClick={() => navigate(`/rush/main`)}
                >
                    Rush
                </button>
            </div>

            {/* User Name Display and Menu Button */}
            <div className="absolute top-4 right-4"> {/* Positioning the container to the top right */}
                
                <button 
                    className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
                    onClick={toggleDropdown}
                >   
                    {user ? user.username : ''}
                </button>
                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 bg-white border rounded shadow-lg">
                        <button 
                            className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                            onClick={() => logout({ nav: navigate })}
                        >   
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home;


{/* <h1>Points System</h1>
<li>100 - Referring a Person </li>
<li> 20% of the points a refered person earns - For legal purposes points earned from referring other people will not be counted in the percentage </li>
<li>25 - Completing Daily Puzzle </li>
<li>50 - Correctly Anwsering Daily Puzzle </li>
<li>10*streak - You will earn points each day for your streak count * 10</li>
<h1>Prizes</h1>
<li>100 points = candy</li>
<li>500 points = Pencil </li>
<li>1000 points = Pen </li> */}
