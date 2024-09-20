import React from 'react'
import { useState,useEffect } from 'react'
import userCheck,{insert,getState,getData,getTests,update,updateUser} from './backend.jsx'
import { useSearchParams,useNavigate, Link} from 'react-router-dom';
import NotFound from './home.jsx'
import Bar from './bar.jsx'

const Display=({userData,d,yesterday})=>{
    const [data,setData]=useState(null)
   
    const [choice,setChoice]=useState(d in userData.info.answers?userData.info.answers[d]:null)
    async function changeAcc({res}){
        
        const temp=userData
        temp.info.answers[d]=res
        
        const t=await getData({col:'puzzles',id:data.id})
        
        if (res===data.ans){
            temp.info.points=temp.info.points+75
            temp.info.streak=temp.info.streak+1
            t.acceptance[0]=t.acceptance[0]+1
            t.acceptance[1]=t.acceptance[1]+1
        }else{
            temp.info.points=temp.info.points+25
            temp.info.streak=0
            t.acceptance[1]=t.acceptance[1]+1
        }
        await updateUser({col:'users',id:userData.id,info:temp})
        await updateUser({col:'puzzles',id:data.id,info:t})
        
        
    }
    
    const Question=()=>{
        
        
        return(
            <div className="p-2  rounded-lg shadow-lg space-y-4">
            <div>
                <p className="text-xl font-bold text-gray-800">{d.split('-')[0]+'-'+String(parseInt(d.split('-')[1])+1)+'-'+d.split('-')[2]}</p>
                <p className="text-s font-bold text-gray-800">{data.Subject}</p>
                <p className="text-gray-600">
                    Acceptance Rate: &nbsp;
                    {data.acceptance[1] === 0 
                        ? 0 
                        : String((data.acceptance[0] / data.acceptance[1]) * 100).slice(0, 4) + '%'
                    }
                </p>
                <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: data.q }} />
            </div>
            
            <div className="space-y-5">
                {data.choices.map((n, i) => (
                    <button
                        onClick={() => {
                            if (choice === null) {
                                setChoice(i);
                                changeAcc({ res: i });
                            }
                        }}
                        key={i}
                        className="bg-green-500 text-black py-1 px-1 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
                    >
                        {n}
                    </button>
                ))}
            </div>
        
            {choice != null && (
                <div className=" p-2 py-7 rounded-lg">
                    <p className="font-semibold text-gray-800">Your Answer: {data.choices[choice]}</p>
                    <p>&nbsp;</p>
                    <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: data.a }} />
                </div>
            )}
            
            <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out">
                Streak: {userData.info.streak}
            </button>
        </div>
        
        )
    } 
    
    
    



   
async function getPuzzle(){
        const temp=await getTests({col:'puzzles'})
        setData(temp.filter(n=>n.date===d)[0])
    }
    if (data===null){
        getPuzzle()
    }
    function alter(){
        const temp=d.split()[0];
        temp[1]+=1
        const t=temp.join('-')
        
        return t
    }
    return(
        <div>
            
            {data===null?"Loading...":<Question ></Question>}
            
        </div>
    )
}
const Puzzle=()=>{
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [userData,setUser]=useState(null)
    const date = new Date()
    const d=date.getUTCFullYear()+'-'+date.getUTCMonth()+'-'+date.getUTCDate()
    
    date.setDate(date.getDate() - 1); // Subtract one day

    const yesterday =date.getUTCFullYear()+'-'+date.getUTCMonth()+'-'+date.getUTCDate()

    
    async function getAns({userID}){
        const temp=await getData({col:'users',id:userID})
        
        if (!(yesterday in temp.info.answers) && temp.info.streak>1) {
            temp.info.streak=0
            await updateUser({col:'users',id:temp.id,info:temp})
        }
        console.log('got')
        setUser(temp)

    }
    useEffect(() => {
        if (userData === null) {
            const temp = getState();
            if (temp === false) {
                navigate('/?signedIn=0');
            } else {
                setUser(temp)
                getAns({userID:temp.id})
            }
        }
    }, [userData, navigate]);
    console.log(userData)
    return(
        <div  className='bg-yellow-100'>
            <Bar user={userData}></Bar>
            <h1 className="text-5xl font-extrabold text-red-600  mb-6 leading-tight font-poppins">Daily Puzzle</h1>
            
            {userData===null?'loading...':<Display d={d} yesterday={yesterday} userData={userData}></Display>}
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>     <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            
        </div>
    )
}
export default Puzzle