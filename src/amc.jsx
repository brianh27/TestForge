import React from 'react'
import { useState,useEffect } from 'react'
import {useNavigate, BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import './index.css'
import { insert, getTests, login ,logout,getState} from './backend.jsx';
const Amc=()=>{
    const [data,setData]=useState(null)
    
    useEffect(()=>{async function get(){
        const t= await getTests({col:'puzzles'})
        setData(t)
        
    }
    get()
},[])
    return(
        <div className="p-3  rounded-lg shadow-lg space-y-5">
            <h1>Some of the mistakes I've made on AMC 10 mock tests, aops volume 1, and hw from amc 10 series. And my solutions to them redone</h1>
            {data === null ? 'loading...' : (
  data.filter(n => n.Subject === 'Math').map((n,i) => (
    <div key={n.id}>
        <h1 className="text-3xl font-extrabold text-red-600  mb-3 leading-tight font-poppins">Question {i+1}</h1>
      <p dangerouslySetInnerHTML={{ __html: n.q }}/>
      <p dangerouslySetInnerHTML={{ __html: n.a }}/>
      
    </div>
  ))
)}

        </div>
    )
}
export default Amc