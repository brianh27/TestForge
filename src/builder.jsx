import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { insert, getState, change,getTests,getData } from './backend.jsx';
import Bar from './bar.jsx';
import ask from './aiget.jsx';

async function gen({site, setSite,setLink,userData }) {
    const input = prompt("Describe the Website you Want to Build");

    // Get the generated HTML content from the ask function
    const generatedHtml = await ask({
        description: "You are a website builder bot. Your task is to generate HTML code for a modern, clean, and responsive website with inline CSS styles for all elements. Use styles like font-family, background-color, padding, border-radius, text-align, font-size, and color to style the header, navigation menu, product displays, and footer. Ensure that the layout is simple and visually appealing, with sections such as a header with a title, a navigation bar with links, a section for products, and a footer. All styles should be applied inline directly in the HTML tags. Please only return the HTML code with inline styles—do not include any extra English or explanations. DO NOT INCLUDE AN HTML HEADER. Also don't include any style header like style=font-family: Arial, sans-serif; margin: 0; padding: 0;. The styles I provided to you will be default you shall always use. Also exclude the ```html text at the begining and the end. ALSO somewhere, you must add a watermark for testforger.vercel.app, and promote it and say that it is the sponsor of the website",        query: input
    });
    const cleanedHtml = generatedHtml.replace(/<head>.*?<\/head>/s, '').replace(/<body>|<\/body>/g, '');
    const seperated= await ask({
      description: "Using comments to label and seperate this HTML code so that it turns into different sections of the website. ONLY RETURN THE HTML CODE WITH COMMENTS. NO EXTRA ENGLISH.",
      query: cleanedHtml
    });

    
    let t= seperated.split('<!--')
    let temp=[]
    for (let a=0;a<t.length;a++){
      const component=t[a].split('-->')
      temp.push(component)
    }
    // Set the cleaned HTML content for rendering
    setSite(temp);

    const lin=await insert({col:'Websites',data:{Author:userData.username,HTML:temp}})
    setLink(lin)
    window.history.pushState({}, '', window.location.pathname);
    const currentUrl = window.location.href; // Get the current URL
    const newUrl = currentUrl.includes('?') 
      ? `${currentUrl}&e=${lin}` // If there's already a query string, append the new one
      : `${currentUrl}?e=${lin}`; // Otherwise, add the query string

    window.history.pushState({}, '', newUrl)
    //make link custom then make updates to that code state changes. viewer gets different. only user who created can edit.
}

async function call({ai,text,setText,setLoad}){
  setLoad(true)
  const edited = await ask({
    description: "You are a code editing bot; The user will provide you instructions as well as their code. If their instruction does not make sense or requires you to do something other than editing the code, simply just return the provided code verbatim. If not, then edit the code based on their instructions and ONLY return the code with the changes. DO NOT RETURN ANYTHING ELSE.",        query: ai+text
  });
  setText(edited)
  setLoad(false)

}
const Editor=({setSite, setLoading, select,setSelect,site,trig,text,setText,link})=>{
  const [ai,setAi]=useState('')
  const [loading,setLoad]=useState(false)
  
  return(
    <div>
            <p>&nbsp;</p>
            
            <a href={"https://testforger.vercel.app/builder?v="+link} target="_blank">Click to View Website</a>
            <p><a href={"https://testforger.vercel.app/builder?e="+link} target="_blank">Click to Edit Website</a></p>
            <p>&nbsp;</p>
            
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                onClick={() => {
                  setSite(null);
                  setLoading(false);
                  setSelect(null)
                }}
              >
                Press To Reset
              </button>
              {select === null ? (
                <p>Select a part of your Website to Edit</p>
              ) : (
                <div>
                  <p>{site[select][0]}</p>
                  <textarea placeholder="Enter your Code For This Section Here" className="w-full h-80 p-4 border-2 border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500" value={text} onChange={(e)=>setText(e.target.value)} ></textarea>
                  <button
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                  onClick={() => {
                    let temp=site
                    temp[select][1]=text
                    setSite(temp)
                    change({col:"Websites",data:{HTML:site},id:link})
                    trig()
                  }}
                >
                  Propagate Changes
                </button>
                <p> &nbsp;</p>
                <textarea placeholder="Type your AI instructions here" className="w-full h-40 p-4 border-2 border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500" value={ai} onChange={(e)=>setAi(e.target.value)} ></textarea>
                {loading ? (
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500 border-solid"></div>
                ) : (
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                    onClick={() => {
                      call({ ai: ai, text: text, setText: setText ,setLoad:setLoad});
                    }}
                  >
                    Change
                  </button>
                )}

                </div>
              )}
            </div>
  )
}
async function initialize({setUser,navigate,setView,setSite,setLink}){
  
        const queryString = window.location.search;

        // If there are any query parameters, display them
       
        const temp = getState();
        if (temp === false) {
          navigate('/?signedIn=0');
        } else {
          setUser(temp);
        }
        if (queryString) {
          // Create a URLSearchParams object to parse the query string
          const urlParams = new URLSearchParams(queryString);

          // Iterate over all query parameters and log them
          let count=0
          let key=null
          let val=null
          urlParams.forEach((v,k) => {
              count+=1
              
              key=k
              val=v

          });
          if(key==='e'){
            const lis=await getData({col:"Websites",id:val})
            if (lis===false){
              navigate('/?signedIn=1')
            }else{
              
              if (lis['Author']===temp.username){
                setSite(lis['HTML'])
                setLink(val)
                setView(0)
              }else{
                setView(2)
              }
            }
          }else if (key==='v'){
            const lis=await getData({col:"Websites",id:val})
            if (lis===false){
              navigate('/?signedIn=1')
            }else{
              console.log('done')
              setLink(val)
              setSite(lis['HTML'])
              setView(1)
            }
          }else{
            navigate('/?signedIn=1')
          }
          if (count>1){
            navigate('/?signedIn=1')
          }
      } else {
          console.log('No query strings in the URL.');
      }
}
const Builder = () => {
    const navigate = useNavigate();
    const [userData, setUser] = useState(null);
    const [site, setSite] = useState(null);
    const [loading,setLoading]=useState(false)
    const params = new URLSearchParams(window.location.search);
    const [select,setSelect] = useState(null)
    const [text,setText]=useState(null)
    const [dummy,setDummy]=useState(0)
    const [link,setLink]=useState('')
    const [view,setView]=useState(0)
    
    useEffect(() => {
      if (userData === null) {
        initialize({setUser,setSite,setView,navigate,setLink})
      }
      
      }
    , [userData, navigate]);
    function triggerUpdate(){
      
      setDummy(dummy+1)
      
    }
   
    
    if (userData===null){
      return(
        <p>Loading Content....</p>
      );
    }
    
    if (view===0){
      return (
        <div>
          <Bar user={userData} />
          <div className='flex h-screen'>
          

      
          <div className="w-[70%] bg-gray-100">
            {site === null ? (
              <div className="flex justify-center items-center h-screen">
                
                {loading?<div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500 border-solid"></div>:<button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300" onClick={() => {gen({site, setLink,setSite,userData});setLoading(true)}}>Press To Generate Website</button>}
              </div>
            ) : (
              <div>
                
                <div
                  style={{
                    fontFamily: "Arial, sans-serif",
                    backgroundColor: "#f4f4f4",
                    padding: "20px",
                    textAlign: "center",
                  }}
                >
                  {site.map((html, index) => (
                    <div onClick={()=>{setSelect(index);setText(html[1])}} key={index} dangerouslySetInnerHTML={{ __html: html[html.length-1] }} />
                  ))}
                </div>
              </div>
              
            )}
          </div>
          <div className="w-[30%] bg-gray-200">
            {site === null ? (
              <p>Nothing Generated Yet</p>
            ) : (
              <Editor link={link} trig={triggerUpdate} setSelect={setSelect} setSite={setSite} setLoading={setLoading} select={select} site={site} text={text} setText={setText}></Editor>
            )}
          </div>

          </div>
        </div>
      );
    }else if (view===2){
      return(
        <div>
          You are not the author. You do not have access.
        </div>
      )
    }else{
      return(
        

      
     
          
              <div className="flex justify-center items-center h-screen w-full">
            
              <div className='w-full max-w-screen-xl'>
                
                <div
                  style={{
                    fontFamily: "Arial, sans-serif",
                    backgroundColor: "#f4f4f4",
                    padding: "0px",
                    textAlign: "center",
                  }}
                >
                  {site.map((html, index) => (
                    <div key={index} dangerouslySetInnerHTML={{ __html: html[html.length-1] }} />
                  ))}
                </div>
              </div>
              
         
            </div>
      )
    }
  };
  
export default Builder;
