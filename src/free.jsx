import React from 'react'
import { useState,useEffect } from 'react'
import userCheck,{insert,getState,getData,getTests,update,updateUser} from './backend.jsx'
import { useSearchParams,useNavigate, Link} from 'react-router-dom';
import NotFound from './home.jsx'
function CountdownTimer({reset,setCond}) {
    const [time, setTime] = useState(60); // Initial time in seconds
    const [isActive, setIsActive] = useState(true); // Timer active state
  
    useEffect(() => {
      let timer;
      
      if (isActive && time > 0) {
        // Set up the timer to decrease time every second
        timer = setInterval(() => {
          setTime(prevTime => prevTime - 1);
        }, 1000);
      } else if (time === 0) {
        // Stop the timer when time reaches 0
        setIsActive(false);
        setCond(true)
      }
  
      // Cleanup the interval on component unmount or when timer stops
      return () => clearInterval(timer);
    }, [isActive, time]);
  
    return (
      <div className="flex flex-col items-center space-y-4 p-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Time Remaining: {time}s
        </h1>
        {/* Optional button to reset the timer */}
        <button
          onClick={() => {
            setTime(60); // Reset time to 60 seconds
            setIsActive(true); // Activate timer
            setCond(false);
            reset();
          }}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
        >
          Reset
        </button>
      </div>
    );
}
  
const Free=()=>{
    const [points,setPoints]=useState(0)
    const [question,setQuestion]=useState(['1+1',2])
    const [ans,setAns]=useState('')
    const [message,setMes]=useState('')
    const [timerOver,setCond]=useState(false)
    const [board,setBoard]=useState(null)
    const [showL,setShow]=useState(false)
    const [uData,setU]=useState({id:0,info:{record:0}})
    const navigate=useNavigate()
    useEffect(()=>{
    const temp=getState()
    if (temp===false){
      navigate('/')
      return
    }
    else{
      setU(temp)
    }
    },[])
    console.log(uData)
    
    function reset(){
        setPoints(0)
        setQuestion(['1+1',2])
        setAns('')
        setMes('')
       
    }
    
   
    
    
    
    async function updateRecord(){
        const temp=uData
        temp.info.record=points
        setU(temp)
        await updateUser({col:'users',id:uData.id,info:temp})
        

    }
    useEffect(()=>{if (points>uData.info.record){
        updateRecord()
    }},[points])
    useEffect(()=>{
        console.log('update')
        async function leaderboard(){
            let t=await getTests({col:'users'})
            t=t.filter(n=>n.info.record>0)
            setBoard(t.sort((a,b)=>b.info.record-a.info.record))
    
        }
        leaderboard()
    },[showL])
    setTimeout(() => {
        if (parseInt(ans)===question[1]){
            setPoints(points+1)
            setAns('')
            
            const op=Math.floor(Math.random() * 4) + 1;
            if (op===0){
                //addition
                const rand1=Math.floor(Math.random() * 100) + 1;
                const rand2=Math.floor(Math.random() * 100) + 1;    
                setQuestion([`${rand1}+${rand2}`,rand1+rand2])

            }else if (op===1){
                //subtraction
                const rand1=Math.floor(Math.random() * 100) + 1;
                const rand2=Math.floor(Math.random() * 100) + 1;    
                setQuestion([`${rand1}-${rand2}`,rand1-rand2])

            }else if (op===2){
                //multiplication
                const rand1=Math.floor(Math.random() * 12) + 1;
                const rand2=Math.floor(Math.random() * 90) + 1;    
                setQuestion([`${rand1}*${rand2}`,rand1*rand2])
            }else{
                const rand1=Math.floor(Math.random() * 12) + 1;
                const rand2=Math.floor(Math.random() * 90) + 1;    

                setQuestion([`${rand1*rand2}/${rand1}`,rand2])
            }
            

        }

      }, 100);
    console.log(timerOver)
    return(
      <div className="bg-green-100 flex flex-col items-center text-lg space-y-6 p-6">
      <p className="text-2xl font-semibold text-gray-800">{question[0]}</p>
      
      <input
          value={timerOver ? "The Game is Over. Good Job!" : ans}
          onChange={(e) => setAns(e.target.value)}
          disabled={timerOver}
          className="w-full max-w-md p-2 border rounded-lg text-lg text-gray-800"
      />
      
      <p className="text-xl font-medium">Points: {points}</p>
      
      <p className="text-xl font-medium">{message}</p>
      
      <CountdownTimer reset={reset} setCond={setCond} />
      
      <p className="text-xl font-medium text-gray-700">Your Record: {uData.info.record}</p>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
      <button onClick={()=>setShow(!showL)}>{showL?"Hide Leaderboard":"Show Leaderboard"}</button>
      
      
      
      {showL && (
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
          {board === null ? (
            <p className="text-xl font-medium text-gray-600">Loading...</p>
          ) : (
            <ol className="list-decimal pl-5 text-lg text-gray-800">
              {board.map((n, i) => (
                <li key={i} className="mb-2">{n.username}: {n.info.record}</li>
              ))}
            </ol>
          )}
        </div>
      )}
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
export default Free