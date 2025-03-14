import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { insert,imagine, getState, change,getTests,getData } from './backend.jsx';
import Bar from './bar.jsx';
import ask from './aiget.jsx';



function isValidImageURL(url) {
  return new Promise((resolve) => {
    const img = new Image(); 
    img.onload = () => resolve(true);  
    img.onerror = () => resolve(false);

    img.src = url;  
  });
}



async function replaceSrcWithGeneratedLinks({html}) {
  console.log(html)
  const regex = /src="([^"]*)"/g;


  const matches = [...html.matchAll(regex)];


  for (const match of matches) {
      const originalMatch = match[0]; 
      const srcValue = match[1]; 
      const temp=await isValidImageURL(srcValue)
      console.log(temp)
      if (temp){
        continue
      }

      const imageLink = await imagine({ prompt: srcValue });


      html = html.replace(originalMatch, `src="${imageLink}"`);
  }

  return html;
}
async function gen({site, setSite,setLink,userData }) {
    const input = prompt("Describe the Website you Want to Build. Eg. List out the different sections, the topic, the purpose.");


    const Html = await ask({
        description: `You are a website builder bot. If the website prompt is inapprioriate, irrelevant, or confusing, just return a generic website template. Your task is to generate HTML code for a modern, clean, and responsive website with inline CSS styles for all elements. Use styles like font-family, background-color, padding, border-radius, text-align, font-size, and color to style the header, navigation menu, product displays, and footer. Ensure that the layout is simple and visually appealing, with sections such as a header with a title, a navigation bar with links, a section for products, and a footer. All styles should be applied inline directly in the HTML tags. Please only return the HTML code with inline styles—do not include any extra English or explanations. DO NOT INCLUDE AN HTML HEADER. Also don't include any style header like style=font-family: Arial, sans-serif; margin: 0; padding: 0;. The styles I provided to you will be default you shall always use. Also exclude the ALSO somewhere, you must add a watermark for ${window.location.origin}, and promote it and say that it is the sponsor of the website. If you use img to place image, make the src link include the description of the picture`,        query: input
    });
    let generatedHtml=await replaceSrcWithGeneratedLinks({html:Html})
    
    const seperated= await ask({
      description: "Using comments to label and seperate this HTML code so that it turns into different sections of the website. ONLY RETURN THE HTML CODE WITH COMMENTS. NO EXTRA ENGLISH.",
      query: generatedHtml
    });

    
    const cleanedHtml = seperated.split('```html').join('')
    
    let t=cleanedHtml.split('<!--')
    let temp=[]
    for (let a=0;a<t.length;a++){
      const component=t[a].split('-->')
      temp.push(component)
    }

    setSite(temp);

    const lin=await insert({col:'Websites',data:{Author:userData.username,HTML:temp}})
    setLink(lin)
    window.history.pushState({}, '', window.location.pathname);
    const currentUrl = window.location.href;
    const newUrl = currentUrl.includes('?') 
      ? `${currentUrl}&e=${lin}`
      : `${currentUrl}?e=${lin}`; 

    window.history.pushState({}, '', newUrl)
    
}

async function call({ai,text,setText,setLoad}){
  setLoad(true)
  const edited = await ask({
    description: `You are a code editing bot; The user will provide you instructions as well as their code. If their instruction does not make sense or requires you to do something other than editing the code, simply just return the provided code verbatim. 
    If the user specifies you to alter any of the images simply replace the string attached to the src of the indicated img with a brief description of the image 
    that would best fit the users needs/description. IF YOU CHANGE THE SRC STRING, DO NOT REPLACE IT WITH A LINK. JUST REPLACE IT WITH ENGLISH WORDS.
    If not, then edit the code based on their instructions and ONLY return the code with the changes. 
    DO NOT RETURN ANYTHING ELSE.`,        query: ai+text
  });
  console.log(edited)
  let done = await replaceSrcWithGeneratedLinks({html:edited})
  setText(done)
  setLoad(false)

}
const Editor=({setSite, setLoading, select,setSelect,site,trig,text,setText,link})=>{
  const [ai,setAi]=useState('')
  const [loading,setLoad]=useState(false)
  
  return(
    <div className='relative'>
            <p>&nbsp;</p>
            <div className='absolute top-5 left-3 text-blue-500'>
            <a href={window.location.origin+"/builder?v="+link} target="_blank">Click to View Website</a>
            <p><a href={window.location.origin+"/builder?e="+link} target="_blank">Click to Edit Website</a></p>
            </div>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
           
              <button
                className="absolute top-5 right-5 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
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
                  <button onClick={ ()=>{
                    let temp=site
                    
                    temp.splice(select,1)
                    setSite(temp)
                    change({col:"Websites",data:{HTML:temp},id:link})

                    setSelect(null)
                  }
                  }
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300">Delete Section</button>
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
                <textarea placeholder="Type your AI instructions here. This is where to provide links to images, outside stuff. ect." className="w-full h-40 p-4 border-2 border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500" value={ai} onChange={(e)=>setAi(e.target.value)} ></textarea>
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
          
          const urlParams = new URLSearchParams(queryString);

          
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
    const template='<div> This is a New Section </div>'
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
              <div key={69}>
                
                <div
                  style={{
                    fontFamily: "Arial, sans-serif",
                    backgroundColor: "#f4f4f4",
                    padding: "20px",
                    textAlign: "center",
                  }}
                >
                  {site.map((html, index) => (
                <div className="relative">
                  <div
                    key={index}
                    id="section"
                    onClick={() => {
                      setSelect(index);
                      setText(html[1]);
                    }}
                    dangerouslySetInnerHTML={{ __html: html[html.length - 1] }}
                  />
                  <button 
                    key={index+10000}
                    onClick={
                      ()=>{
                        setSelect(index+1)
                        let temp=site
                        temp.splice(index+1,0,['New Section',template])
                        setSite(temp)
                        change({col:"Websites",data:{HTML:temp},id:link})
                        setText(template)
                        triggerUpdate()
                      }
                    }
                    className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-200 text-black rounded-full text-sm flex items-center justify-center shadow transition transform hover:scale-110 hover:shadow-lg z-10">
                    +
                  </button>



                </div>
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
      console.log(site)
      return(
        

      
          
              <div className="flex justify-center items-center min-h-screen w-full">
            
              <div className='w-full max-w-screen-l'>
                
                <div
                  style={{
                    fontFamily: "Arial, sans-serif",
                    backgroundColor: "#f4f4f4",
                    padding: "0px",
                    textAlign: "center",
                  }}
                >
                  {site.map((html, index) => (
                    
                    <div key={index+100000} dangerouslySetInnerHTML={{ __html: html[html.length-1] }} />
                    
                    
                  ))}
                </div>
              </div>
              
         
            </div>
      )
    }
  };
  
export default Builder;
