import React, { useState, useEffect } from 'react';
import userCheck, { insert, getState,imagine, getData, getTests, update, updateUser } from './backend.jsx';
import { useNavigate } from 'react-router-dom';
import Bar from './bar.jsx';
import axios from 'axios';
import ColorSelector from './selector.jsx';
const Image = () => {
    const navigate = useNavigate();
    
    const [userData, setUser] = useState(null);
    const [num, setNum] = useState('');
    const [grid,setGrid]= useState(null)
    const [select,setSelect]=useState(null)
    const [updates,setUpdates]=useState([0])
   
    
    useEffect(() => {
        if (userData === null) {
            const temp = getState();
            if (temp===false){
                navigate('/?signedIn=0')
            }else{
                console.log(temp)
                setUser(temp);
            }
             
        }
    }, []);
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const t = await getTests({ col: 'pixel' });
                setGrid(t[0].pixels);
            } catch (error) {
                console.error('Failed to fetch grid:', error);
            }
            const t=await getData({id:userData.id,col:'users'})
            setUpdates(t.updates)

        }, 1000); // 1000 milliseconds = 1 second
    
        return () => clearInterval(interval); // Cleanup on component unmount
    }, [userData]);

    console.log(updates)
    const Grid=()=>{
        return(
            <div className="w-full flex flex-wrap"> {/* Adjust grid-cols based on your needs */}
                {grid.map((n, i) => (
                    <div
                    onClick={() => setSelect(i)}
                    key={i}
                    className={`w-12 h-12 ${i === select ? 'border-2 border-gray-900' : ''}`}
                    style={{ backgroundColor: n }}
                    />
                ))}
            </div>

          
        )

    }
    return (
        <div>
            <Bar user={userData} />
            {grid===null?"Loading...":<Grid></Grid>} 
            
            <div className="flex justify-center mt-10">
                <ColorSelector grid={grid} updates={updates} userData={userData}pick={select}></ColorSelector>
            </div>
        </div>
    );
};

export default Image;
