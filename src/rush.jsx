import Free from './free.jsx'
import MathOff from './MathOff.jsx'
import { useParams } from 'react-router-dom';
import { useState,useEffect } from 'react'
import { useSearchParams,useNavigate, Link} from 'react-router-dom';
import userCheck,{getData,logout,getState} from './backend'
import Bar from './bar.jsx'
function Rush() {

  const [uData,setU]=useState(null)
  const navigate = useNavigate();
  useEffect(() => {
    if (uData === null) {
        const temp = getState();
        if (temp === false) {
            navigate('/?signedIn=0');
        } else {
            setU(temp);
        }
    }
}, [uData, navigate]);
  const { mode } = useParams();
  
  const Page=()=>{
    return(
        <div className='bg-green-100'>
            
            <div className="flex flex-col items-center text-lg space-y-4">
              <p>&nbsp;</p>
              <h1 className="text-6xl font-extrabold text-red-600 mb-8 leading-tight font-poppins">
                  Rush
              </h1>
              <div 
                className="cursor-pointer p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition ease-in-out duration-300"
                onClick={() => navigate('/rush/timed')}
              >
                <p className="text-lg font-semibold text-gray-800 ">Timed</p>
                <p className="text-sm text-gray-600">Challenge yourself with a 1 minute math battle. Try and solve as many arithemtic problems as you can in that time</p>
              </div>
              <div 
                className="cursor-pointer p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition ease-in-out duration-300"
                onClick={() => navigate('/rush/math-off')}
              >
                <p className="text-lg font-semibold text-gray-800">Math Off</p>
                <p className="text-sm text-gray-600">Multiplayer version of Rush; You can challenge other players to see who can solve a problem set first. (Still in Progress)</p>
              </div>
            </div>
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
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            
        </div>
    )
  }
  console.log(mode)
  return (
    <div>
      <Bar user={uData}></Bar>
      
      
      {mode === 'main' && <Page></Page>}
      

      {mode === 'timed' && <Free uData={uData} setU={setU}></Free>}
      {mode === 'math-off' && <MathOff></MathOff>}
      
    </div>
  );
}

export default Rush;
