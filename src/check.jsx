import React from 'react'
import { useState ,useEffect} from 'react'
import ask from'./aiget.jsx'
import userCheck,{insert,getTests} from './backend.jsx'
import validator from 'validator';
export default async function check({mail,newUser,newPass,setError,usernam,res,setRes}){
    

    const isValidEmail = (email) => validator.isEmail(email);
    
    

    setError(10)
    const response=await ask({description:`YOU WILL ONLY RETURN THE LETTER Y OR N. YOU ARE A USERNAME CHECKER. IF the username provided is inappropriate return Y, 
        if it is appropriate return N. Be very strict, avoid racism, any discrimination, being mean, objectification or anything else politically 
        incorrect or you shouldn't bring up at the dinner table to your family`,query:newUser})
      
    console.log(response)
    if (response==='Y'){
      setError(5)
      
    }else{
          
      
      
      if (usernam===null){
        setError(0)
        
      }
      
      else if (usernam.find(n=>n.username.toLowerCase()===newUser.toLowerCase())!=undefined){
        console.log(newUser.toLowerCase)
        setError(1)
        
      }else if (/^[a-z]+$/.test(newUser.toLowerCase())===false){
          console.log(newUser.toLowerCase())
          setError(2)
      }
      else if (usernam.find(n=>n.email===mail)!=undefined){
          
          setError(3)
          
      }
      else if (isValidEmail(mail)===false){
          setError(4)
      
      }else if (newPass.length>25 ||newPass.length<5){
          setError(6)
      }else if (  newPass.match(/[^\w\s]/g)&&symbols.length<3){
          setError(7)
      //}else if (newPass.toLowerCase().includes('cow')===false){
        //  setError(8)
      }else{
          console.log('done')
          setError(13)
      }
    }
      

    
    
      
    
  
}