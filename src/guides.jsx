import React from 'react'
import { useState,useEffect } from 'react'
import Login from './login.jsx'
import { Link } from 'react-router-dom';
import ask from "./aiget.jsx"
import userCheck,{insert,getState,imagine,getData,getTests,update} from './backend.jsx'
import { set } from 'mongoose';
import { useSearchParams,useNavigate } from 'react-router-dom';
import NotFound from './home.jsx'
import Bar from './bar.jsx'

async function getResult({i,ans,storedAns,setMem,num}){
               
                
                
    const gx = [...storedAns];
    gx[num] = [...gx[num]];

    // Update the specific value
    gx[num][1] = "Loading, please wait...";
    setMem(gx); // Set the updated state

    
    const val=await ask({description:`You are a helpful checker bot. You are provided two phrases, the left phrase is the users answer, and the right phrase is the correct solution. Return "Please Type an Anwser" if the anwser is blank. Return if the user answer is either "Excellent" (if there are just a few mistakes), "Incorrect"(if the general definition of the user anwser totally does not match the solution), or "Close enough" (which means the input is a synynom or has a definition similar to that of the solution)`,query:`User anwser: ${i} and the correct anwser: ${ans}`})
    const t = [...gx];
    t[num] = [...t[num]];
    t[num][1] = (
        <div>
            <p className={val==='Excellent'|val==='Close enough'?"text-4xl font-semibold text-green-500 font-poppins":"text-4xl font-semibold text-red-500 font-poppins"}>{val}</p>
            <p>Your answer: {i}</p>
            <p>Correct answer: {ans}</p>
        </div>
    );
    setMem(t);
    
}
const Write=({setFormat, format, edits, setEdits, setaccept, accept, update, user, idNum,setID,images})=>{
    
    const topics=['Math',"Science",'Social Studies',"Literature",'Other']
    const toAccept=['Please make sure you have a title','Please make sure you have the topic Math, Science, Social Studies, Literature, or Other','Please make sure your vocab each have definitions below them','Please make sure your quiz questions each have anwsers below them',"Please make sure you have an essay prompt"]
    function updateServer({i}){
            
        
        const temp=format({t:i[4],v:i[0],q:i[1],e:i[2],s:i[3]})[0]
       
        
        setFormat(temp)
       

        
        
    }
    function processChange({ e, i }) {
        setEdits((edits) => {
            const newEdits = [...edits];
            newEdits[i] = e.target.value;
            return newEdits;
        });
    }
    function check(){
        if (edits[4].trim().length===0){
            setaccept(0)
        }else if (topics.find(n=>n===edits[3])===undefined){
            setaccept(1)
        }else if (edits[0].split('\n').length%2===1||edits[0].split('\n').find(n=>n.trim().length===0)!=undefined){
            setaccept(2)
        }else if (edits[1].split('\n').length%2===1 ||edits[1].split('\n').find(n=>n.trim().length===0)!=undefined){
            setaccept(3)
        }else if (edits[2].split('\n').length===0||edits[2].split('\n').find(n=>n.trim().length===0)!=undefined){
            setaccept(4)
        }else
        {
            setaccept(5)
        }
    }
    async function handle(){
        const t=await format({t:edits[4],v:edits[0],q:edits[1],e:edits[2],s:edits[3]})
        console.log(t)
        const temp=await update({edi:user,id:idNum,col:'Test',images:images,cards:t[0]})
        console.log(temp)
        if (temp!=true){
        setID(temp)
        }
    }
    check()
    return(
        <div>
            <form onSubmit={(event) => {
                    event.preventDefault();
                    updateServer({ i: edits});
                    
                }}>
                    <p><input placeholder="Enter your title" value={edits[4]} onChange={(e)=>processChange({e:e,i:4})}></input></p>
                    <p><input placeholder="Enter your topic" value={edits[3]} onChange={(e)=>processChange({e:e,i:3})}></input></p>
                    <textarea
                        id="vocab"
                        name="vocab"
                        rows="10"
                        cols="50"
                        placeholder="Enter your vocab with its definition on the line below"
                        defaultValue={edits[0]}
                        
                        onChange={(e)=>processChange({e:e,i:0})}
                        
                    ></textarea>
                    <textarea
                        id="quiz"
                        name="quiz"
                        rows="10"
                        cols="50"
                        placeholder="Enter your quiz question with its anwser on the line below"
                        defaultValue={edits[1]}
                        //value={edits[1]} // Controlled input
                        onChange={(e)=>processChange({e:e,i:1})}
                    ></textarea>
                    <textarea
                        id="essay"
                        name="essay"
                        rows="10"
                        cols="50"
                        placeholder="Enter your essay prompts"
                        defaultValue={edits[2]}
                        //value={edits[2]} // Controlled input
                        onChange={(e)=>processChange({e:e,i:2})}
                    ></textarea>

                    
                    {accept===5?
                    <div>
                        <p><button type="submit">Update Your Current Study Guide</button></p>
                        <p><button type='button' onClick={handle}>Propogate and save the changes to the server</button></p>
                    </div>
                    :<p>{toAccept[accept]}</p>}
            </form>
            
        </div>
        
    )
}
const Guides=()=>{
    const [mode,setMode]=useState(0)
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            const data = await getTests({col:"Test"}); 
            
            setTest(data);
        };

        fetchData();
    }, [mode]);
    const [user,setUser]=useState(null)

    if (user===null){
        const temp=getState()     
        if (temp===false){
            navigate('/?signedIn=0')
        }else{
            setUser(temp)
            console.log(temp.email)
            
            
            
        }

    }
    const [cards,setCards]=useState(null)
    const [notify,setNotify]=useState(0)
    const [param,setParam]=useState([10,8,2])
    const notifications=['','Please Wait...','Please enter some thing academic related.','Generated practice test. Press this button to save.','Practice Test saved on server!']
    
    const [formatted,setFormat]=useState(null)
    const [num,setNum]=useState(0)
    const [topic,setTopic]=useState(4)
    const [idNum,setID]=useState(null)
    const topics=['Math',"Science",'Social Studies',"Literature",'','Other']
    const [accept,setaccept]=useState(3)
    const [test,setTest]=useState(null)
    const [edits,setEdits]=useState(['','','','',''])
    const [images,setImages]=useState(Array(100).fill(null))
    
    const [flip,setFlip]=useState(0)
    
    const [storedAns,setMem]=useState([])
  
    

    function setA({t}){
        console.log(t.length)
        console.log('compiled')
        if (t!=null){
            const ans=[];
            for (let a=0;a<t.length;a+=1){
                ans.push(['',null])
            };
            setMem(ans)
        }
    }
    
  
    async function format({t,v,q,e,s,first}){
        
        setNum(0)
        const info=[]
        const vocab=v.split('\n')
        const temp=[]
        
        for (let i=0;i<vocab.length/2;i+=1){
            info.push([0,vocab[i*2],vocab[i*2+1]])
            if (first){
                
                temp.push(null)
            }
            
        }
        const quiz=q.split('\n')
        
        for (let i=0;i<quiz.length/2;i+=1){
            info.push([1,quiz[i*2],quiz[i*2+1]])
            if (first){
                const response=await imagine({prompt:quiz[i*2]})
                temp.push(response)
            }
        }
        const essay=e.split('\n')
        
        for (let i=0;i<essay.length;i+=1){
            info.push([2,essay[i]])
            if (first){
                const response=await imagine({prompt:essay[i]})
                temp.push(response)
            }
        }
        info.push(t)
        info.push(s)

        return [info,temp]
        
    }
    console.log(formatted)
    async function generateCards(event){
        
        setNotify(1)
        const formData= new FormData(event.target)
        const response=formData.get('response')
        event.preventDefault()
        const title=await ask({description:`You are a practice test maker. The user will send you a list of their notes or simply a general topic. If the response does not make sense in this context or is not academic, test, or learning related return blank. If the topic is academic return a phrase on one single line which is a title which best embodies the topic of the input the user submitted`,query:response})
        if (title===''){
            setNotify(2)
        }else{
            const v=await ask({description:`You are a practice test maker. Follow my directions EXACTLY, you must be EXACT. The user will send you a list of their notes or simply a general topic. Write EXACTLY ${param[0]} key vocabulary words, and its definition on the line below the question. Then separate the vocab and definition with a blank line. This is the order for an individual chunk: vocab, definition, blank line... and so on You will only be returning EXACTLY ${param[0]} of these chunks.`,query:response})
           
            const q=await ask({description:`You are a practice test maker. Follow my directions EXACTLY, you must be EXACT. The user will send you a list of their notes or simply a general topic that you must base all of your quiz questions around. Write EXACTLY ${param[1]} quiz questions (unnumbered) with  an answer of just a phrase or one word to it. Then space out different questions with a blank line. This is the order: question, answer, blank line... and so on For math and science questions only provide practice problems related to the subject.`,query:response})
            
            const e=await ask({description:`You are a practice test maker. Follow my directions EXACTLY, you must be EXACT. The user will send you a list of their notes or simply a general topic. The only thing you will return is EXACTLY ${param[2]} essay prompts relating to the subject the user inputted. Seperate the essay prompts with one blank line. This is the order: Question, blank line, Question ... and so on`,query:response})
            
            const subject =await ask({description:`Based on the description given either return the word "Math", "Science", "Literature", "Social Studies" or "Other" based on the subject matter that the user input is based most closely around.`,query:response})
            
            let vocabs=v.split('\n').filter(n=>n.trim()!='').join('\n')
            
            
            let quizs=q.split('\n').filter(n=>n.trim()!='').join('\n')
           
            
            let essay=e.split('\n').filter(n=>n.trim()!='').join('\n')
            

            setEdits([vocabs,quizs,essay,subject,title])
            
            
            const temp=await format({t:title,v:vocabs,q:quizs,e:essay,s:subject,first:true})
            console.log(temp)
            setFormat(temp[0])
            setImages(temp[1])
            
            setA({t:temp[0]})
            setID(Math.random())

            setNotify(3)
            
        }
        

        
        
        
        
    }
    console.log(images)
    const Generate=()=>{
        const Slider=({text,code})=>{
            
            return (
                <div className="flex items-center space-x-4">
                    <b className="text-gray-800">{text}:</b>
                    <button
                        onClick={() => {
                        if (param[code] > 1) {
                            const temp = [...param];
                            temp[code] -= 1;
                            setParam(temp);
                        }
                        }}
                        className="bg-gray-500 text-white px-1.5 py-0.2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ease-in-out duration-150"
                    >
                        -
                    </button>
                    <span className="text-lg font-semibold text-gray-700">{param[code]}</span>
                    <button
                        onClick={() => {
                        if (param[code] < 25) {
                            const temp = [...param];
                            temp[code] += 1;
                            setParam(temp);
                        }
                        }}
                        className="bg-gray-500 text-white px-1.5 py-0.2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ease-in-out duration-150"
                    >
                        +
                    </button>
                </div>
            )
        }
        async function addToServer(){
            console.log(user)
            const id=await insert({data:{Practice_Tests:formatted,images:images,username:user.username,editors:null},col:"Test"})
            setID(id)
 
        }
        
        return(
            <div>
            

            {notifications[notify]}
            {notify===3 ?<button className="bg-gray-500 text-white px-1.5 py-0.2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ease-in-out duration-150" onClick={()=> {addToServer(); setNotify(4)}}>Save to Server</button>:''}
            <p></p>
            <Slider text={'Vocabulary'} code={0}></Slider>
            <Slider text={'Short Response'} code={1}></Slider>
            <Slider text={'Essay`s'} code={2}></Slider>
            <p></p>
            <form onSubmit={generateCards}>
                
                <textarea classname='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' id="response" name="response" rows="10" cols="50" placeholder="Paste your subject or your notes in the box below to generate a practice test"></textarea>
                
                <p><button disabled={notify===1} type="submit" className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-green-600'>Submit</button></p>
                
            </form>
            </div>
        )
    }
    
    const Search=()=>{
        const [inputValue, setInputValue] = useState("")
        
        
        
        if (test===null){
            return(
                <div>
                    <p>Choose a pre-generated study guide of your choice</p>
                    <p>Search for Current Topic: <button onClick={()=>setTopic((topic+1)%6)}>{topics[topic]}</button></p>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <p>loading...</p>
                </div>
            )
        }else{
            
            return(
                <div>
                    <p>Choose a pre-generated study guide of your choice</p>

                    <p>&nbsp;</p>
                    Search for Current Topic:
                    <p> <button className='bg-green-500 text-white h-8 px-10 m-2 py-0.2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ease-in-out duration-150' onClick={()=>setTopic((topic+1)%6)}>{topics[topic]===''?'None':topics[topic]}</button></p>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    {test.filter(t=>t.Practice_Tests[t.Practice_Tests.length-2].toLowerCase().includes(inputValue.toLowerCase())&& t.Practice_Tests[t.Practice_Tests.length-1].includes(topics[topic])).map((n,i)=><li key={i}>
                    <button onClick={()=>{setFormat(n.Practice_Tests);setImages(n.images);setA({t:n.Practice_Tests});setID(n.id);
                    
                        setEdits([n.Practice_Tests.map((t,i)=>t[0]===0?'\n'+t[1]+'\n'+t[2]:'').join('').slice(1,10000),n.Practice_Tests.map(t=>t[0]===1?'\n'+t[1]+'\n'+t[2]:'').join('').slice(1,10000),n.Practice_Tests.map(t=>t[0]===2?'\n'+t[1]:'').join('').slice(1,10000),n.Practice_Tests[n.Practice_Tests.length-1],n.Practice_Tests[n.Practice_Tests.length-2]])
                        
                        }}>
                        {n.Practice_Tests[n.Practice_Tests.length-2].slice(0,100)}...</button> Created by: {n.username} {n.editors!=null&&'Edited by:.'+[... new Set(n.editors)]} </li>) }
                    <p></p>
                </div>
            )
        }
        
    }
    
    
    
    const Display=(props)=>{

        const Vocab=({card})=>{
            return(
                
                <div >
                <button
                  onClick={flip === 0 ? () => setFlip(1) : () => setFlip(0)}
                  className="text-xl font-bold text-black-800 bg-gray-300 hover:bg-gray-400 text-black h-64 w-80 px-4 py-2 rounded-lg transition duration-300 ease-in-out overflow-hidden flex items-center justify-center"
                >
                  <span className="text-center break-words">{card[flip + 1]}</span>
                  {images[num]!=null&&<img  className="max-w-[150px] max-h-[150px] w-auto h-auto" src={images[num]} alt="From Google Images" />}
                </button>
              </div>
              

            )
        }
        const Quiz=({card})=>{
           
            const handleSubmit=(event)=>{
                event.preventDefault();
                const data=new FormData(event.target);
                const i = data.get('inputField')
                getResult({i,ans:card[2],storedAns:storedAns,setMem:setMem,num:num})
                
            }
            useEffect(()=>{const temp=0},[storedAns])
            console.log(storedAns)
            return(
                <div>
                    {card[1]}
                    {images[num]!=null&&<img  className="max-w-[200px] max-h-[200px] w-auto h-auto" src={images[num]} alt="From Google Images" />}
                    <form onSubmit={handleSubmit}>
                        <input type="text" placeholder="Type your Answer Here" name='inputField'/>
                        <button className='bg-blue-500 text-white px-1.5 py-0.2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ease-in-out duration-150' disabled={storedAns[num][1]==="Loading, please wait..."}type="submit">Submit</button>
                    </form>
                    {storedAns[num][1]}
                </div>
            )
        }
        const Essay=({card})=>{
            const [response,setResponse]=useState(null)
            
            async function resulter(props){
                
                console.log('Called')
                const temp=[...storedAns]
                temp[num][1]='Loading. Please Wait...'
                setMem(temp)
                
                const val=await ask({description:`You are a helpful checker bot. The user response is on the left side. The prompt is on the right side. Give a detailed and nuaced feedback to this essay detailing its qualities and where it can be improved especially with inaccuracies and clearness and organization and concicseness. Limit it to under 150 words.`,query:`${props.i} and ${props.ans}`})
                //props.d(val)
                const temps=[...storedAns]
                temps[num][1]=val

                setMem(temps)
                
            }
            useEffect(()=>setResponse(response),[storedAns])
            
            return(
                <div>
                    {card[1]}
                    {images[num]!=null&&<img  className="max-w-[200px] max-h-[200px] w-auto h-auto" src={images[num]} alt="From Google Images" />}
                    <form onSubmit={(event) => {
                        
                        event.preventDefault();
                        resulter({ i: response===null?storedAns[num][0]:response, ans: card[1]});
                    }}>
                        <textarea
                            id="response"
                            name="response"
                            rows="10"
                            cols="50"
                            placeholder="Enter your answer here..."
                            value={response===null?storedAns[num][0]:response} // Controlled input
                            onChange={(e) => {setResponse(e.target.value);const temp=storedAns; temp[num][0]=e.target.value;setMem(temp)}} 
                        ></textarea>

                        <p><button className='bg-blue-500 text-white px-1.5 py-0.2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ease-in-out duration-150' type="submit" disabled={storedAns[num][1]==="Loading. Please Wait..."}>Submit</button></p>
                    </form>
                    {storedAns[num][1]}
                </div>
            
            )
        }
        const formatted=props.text
        
        const num=props.num
        if (formatted===null){
            return(
                <div>
                    <h1>No Content Yet</h1>
                </div>
            )
        }
        console.log(num)
        return (
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-5">{formatted[formatted.length-2]}</h1>
                {<div><button onClick={()=>{setNum((num-1+(formatted.length-2)*10)%(formatted.length-2)); setFlip(0);}} className="bg-gray-500 text-white px-1.5 py-0.2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ease-in-out duration-150">Previous</button><button onClick={()=>{setNum((num+1+(formatted.length-2)*10)%(formatted.length-2)); setFlip(0);}}className="bg-gray-500 text-white px-1.5 py-0.2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ease-in-out duration-150">Next</button></div>}
                <b>{num+1} out of {formatted.length-2}</b>
                {formatted[num][0]===0?<Vocab card={formatted[num]}></Vocab>:(formatted[num][0]===1?<Quiz card={formatted[num]}></Quiz>:<Essay card={formatted[num]}></Essay>)}
                
            </div>
        )
    }
    const Starred=()=>{
        return(
            <div>
                <h1>In progress...</h1>
            </div>
        )
    }
   
    const pages=[<Generate></Generate>,<Search setCards={setCards}></Search>,<Write  images={images} setID={setID} setFormat={setFormat}     format={format} edits={edits} setEdits={setEdits} setaccept={setaccept} accept={accept} update={update} user={user===null?'':user.username} 
        idNum={idNum}
    ></Write>,<p></p>,<Starred></Starred>]


    
    return (
        <body className='bg-blue-200'>
        <div><Bar user={user}></Bar>
        
        <div className="p-4 space-y-4">
            
            <h1 className="text-2xl font-bold mb-4">AI Study Guide Generator</h1>
            <div className="flex space-x-2">
                <button 
                    onClick={() => setMode(0)} 
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Generate
                </button>
                <button 
                    onClick={() => setMode(1)} 
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-green-600"
                >
                    Search
                </button>
                <button 
                    onClick={() => setMode(2)} 
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-yellow-600"
                >
                    Edit
                </button>
                <button 
                    onClick={() => setMode(4)} 
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-red-600"
                >
                    Starred
                </button>
                <button 
                    onClick={() => setMode(3)} 
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-purple-600"
                >
                    Fullscreen
                </button>
              
            </div>
            <div className="mt-4">
                {pages[mode]}
            </div>
            <div className="mt-4">
                {Display({num: num, text: formatted, flip: flip})}
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
                        
        </div>
        </div>
        </body>
    );
    
}

export default Guides