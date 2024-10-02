import React, { useState, useEffect } from 'react';
import userCheck, { insert, getState,imagine, getData, getTests, update, updateUser } from './backend.jsx';
import { useNavigate } from 'react-router-dom';
import Bar from './bar.jsx';
import axios from 'axios';

const Image = () => {
    const navigate = useNavigate();
    
    const [userData, setUser] = useState(null);
    const [num, setNum] = useState('');

    
    useEffect(() => {
        if (userData === null) {
            const temp = getState();
            if (temp===false){
                setUser(null)
            }else{
                setUser(temp);
            }
             
        }
    }, [userData, navigate]);


    return (
        <div>
            <Bar user={userData} />
            <h1 className="text-5xl font-extrabold text-red-600 mb-6 leading-tight font-poppins">
                TestForger Terms of Service
            </h1>
            <p>Thank you for your interest in using Testforger. The following terms of service outline what the user can and cannot do regarding the use of the website: <a href="https://testforger.vercel.app">https://testforger.vercel.app</a></p>
            <p>Failure to comply with the provided guidelines may result in changes to user information, warnings or termination of account and life.</p>
            
            <h2>PLEASE READ THE FOLLOWING TERMS OF SERVICE CAREFULLY</h2>
            <p>BY ACCESSING, BROWSING, OR REGISTERING FOR THE WEBSITE, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THE FOLLOWING TERMS AND CONDITIONS.</p>

            <ul>
                <li>You may not use the Image Generator at /image to generate any inappropriate content, including but not limited to, Diddy, Drake, memes or otherwise skib behavior.</li>
                <li>You may not use a calculator for the timed Rush mode (specifically for Brett). You may not hack the timed Rush page to grant yourself extra time.</li>
                <li>You may not use obscene language in the discord server.</li>
                <li>You may not input verbose prompts in the Guides section.</li>
                <li>You may not generate study guides regarding Puff Daddy, Drake, or any other non-academic subjects.</li>
                <li>Your name must be something appropriate.</li>
                <li>You must not steal the API key used for generating AI prompts, or else you could potentially spam.</li>
            </ul>

            <p>Here is the API key that you shouldn’t use: <strong>t4TFW3Hawws3OpcqDs1vGQz78RZtRc8lOrSnPFyHTpvvuY6z1qOlBRNwzxz6TZexRxlo6740kuGCEeNwGWbV9UJjrtYVN8QzPVlgn7yA4IUH4Kj5aVVDoXHLcJovi9Yv</strong></p>

        
        </div>
    );
};

export default Image;
