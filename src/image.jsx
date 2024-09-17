import React, { useState, useEffect } from 'react';
import userCheck, { insert, getState,imagine, getData, getTests, update, updateUser } from './backend.jsx';
import { useNavigate } from 'react-router-dom';
import Bar from './bar.jsx';
import axios from 'axios';

const Image = () => {
    const navigate = useNavigate();
    
    const [userData, setUser] = useState(null);
    const [num, setNum] = useState('');
    const [disable, setDisable] = useState(false);
    const [image, setImage] = useState(null);

    
    useEffect(() => {
        if (userData === null) {
            const temp = getState();
            if (temp === false) {
                navigate('/?signedIn=0');
            } else {
                setUser(temp);
            } 
        }
    }, [userData, navigate]);

    
    async function getImage(event) {
        event.preventDefault();  
        setDisable(true)
        const response=await imagine({prompt:num})
        setImage(response)
        
        setDisable(false)
    }

    console.log(image)

    return (
        <div>
            <Bar user={userData} />
            <h1 className="text-5xl font-extrabold text-red-600 mb-6 leading-tight font-poppins">
                Image Generator
            </h1>
            
            <form onSubmit={getImage}>
                <input
                    value={num}
                    onChange={(e) => setNum(e.target.value)}
                    placeholder='Type your Image Prompt Here'
                />
                <p>
                    <button type='submit' disabled={disable}>Submit</button>
                </p>
            </form>
            
            
            {image && (
                <div>
                    <img src={image} alt="Generated from prompt" />
                </div>
            )}
        </div>
    );
};

export default Image;
