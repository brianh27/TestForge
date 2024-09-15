import React from 'react'
import { useState,useEffect } from 'react'
import userCheck,{insert,getState,getData,getTests,update,updateUser} from './backend.jsx'
import { useSearchParams,useNavigate, Link} from 'react-router-dom';
import NotFound from './home.jsx'
import Bar from './bar.jsx'

   
const Tools=()=>{
    const navigate = useNavigate();
    
    const [userData,setUser]=useState(null)
    
    const [num,setNum]=useState('')
    const [sig,setSig]=useState(0)
    

    useEffect(() => {
        if (userData === null) {
            const temp = getState();
            if (temp === false) {
                navigate('/?signedIn=0');
            } else {
                setUser(temp)

            }
        }
    }, [userData, navigate]);
    useEffect(()=>{
        function check({num}){
            console.log(parseFloat(num))
            
          
            
            
            if (num.includes('*') ){
                const n=num.split('*')[0].split('.')
            }else{
                
            }
            const n=num.split('.')
            console.log(n)
            
              
            
            const fig=[]
            console.log(n)
            for (let a=0;a<n[0].length;a+=1){
                
                if (parseInt(n[0][a])===0){
                    fig.push(false)
                }else{
                    fig.push(true)
                    
                }
            }
           
            
            if (n.length===2){
                for (let a=0;a<n[1].length;a+=1){
                
                    if (parseInt(n[1][a])===0){
                        fig.push(false)
                    }else{
                        fig.push(true)
                        
                    }
                }
                console.log(fig)
                for (let a=n[1].length-1;a>=0;a-=1){
                    console.log(parseInt(n[1][a]))
                    if (parseInt(n[1][a])!=0){
                        break
                    }
                    fig[fig.length-(n[1].length-a)]=true
                }
            }
            console.log(fig)
            if (fig.filter(num => num === true).length!=0){
                let left=0
                let right=fig.length
                for (let a =0;a<fig.length;a+=1){
                    if (fig[a]===true){
                        break
                    }
                    left+=1
                    
                }
                for (let a =fig.length-1;a>=0;a-=1){
                    if (fig[a]===true){
                        break
                    }
                    right-=1
                    
                }
                    

                console.log(left)
                console.log(right)
                for (let a =left;a<right;a+=1){
                    fig[a]=true
                }
            }
            setSig(fig.filter(num => num === true).length)
        }
        
        check({num:num})
        

        
        
        
    },[num])
    return(
        <div>
            <Bar user={userData}></Bar>
            <h1 className="text-5xl font-extrabold text-red-600  mb-6 leading-tight font-poppins">Sig Fig Calculator</h1>
            
            <input value={num} onChange={(e)=>setNum(e.target.value)} placeholder='Type your Number Here'></input>
            <p>{sig}</p>    
        </div>
    )
}
export default Tools