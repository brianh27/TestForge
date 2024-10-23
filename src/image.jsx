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
                    <img src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.outsideonline.com%2Fculture%2Factive-families%2Fhow-to-read-dog-body-language-happy-aggressive%2F&psig=AOvVaw1bH_ZSSKXFQ-ukNA86bno9&ust=1729807834537000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCLC5y73CpYkDFQAAAAAdAAAAABAE" 
     srcset="{image_large} 2x" 
     alt="Generated from prompt" 
     class="w-[150%] h-auto object-contain" />


                </div>
            )}
        </div>
    );
};

export default Image;
