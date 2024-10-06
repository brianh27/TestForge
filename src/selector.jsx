import React, { useState } from 'react';
import { updateGrid } from './backend';
const ColorSelector = ({grid,updates,userData,pick}) => {
  const [select, setSelect] = useState(null);
  const colors = [
    "#FF0000",  
    "#0000FF",  
    "#FFFF00",  
    "#000000",  
    "#FFFFFF",  
    "#00FF00",  
    "#00FFFF",  
    "#FF00FF",  
    "#FFA500",  
    "#800080",  
    "#FFC0CB",  
    "#A52A2A",  
    "#808080",  
    "#00FF00",  
    "#008080",  
    "#000080"   
]
const millis=Date.now()
const timer=Math.max(30-Math.floor((millis-updates[updates.length-1])/1000),0)  
async function change(){
    const temp=[...grid]
    temp[pick]=colors[select]
    updateGrid({col:'pixel',id:'gza3w3xdmxr6q8h',data:{pixels:temp}})
    const t=[...updates]
    t.push(millis)
    
    updateGrid({col:'users',id:userData.id,data:{updates:t}})
  }
  console.log(Date.now())
  
  return (
    <div className="flex flex-col items-center mt-4">
    <div className="flex flex-wrap justify-center">
      {colors.map((color, i) => (
        <div
          key={i}
          onClick={() => setSelect(i)}
          className={`w-12 h-12 m-1 cursor-pointer transition-transform duration-200 
            ${i === select ? 'border-4 border-blue-500 transform scale-110' : 'border border-transparent'}`}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
    <p>{"00:00:" + (String(timer).length === 1 ? "0" + timer : timer)}</p>
    <div className="flex justify-center mt-4">
            
      
      <button
        disabled={select === null || pick===null || timer>0}
        onClick={() => change()}
        className="bg-blue-500 text-white p-2 rounded shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
      >
        Submit
      </button>
    </div>
  </div>
  
  
  
  );
};

export default ColorSelector;