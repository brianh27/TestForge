import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { insert, getTests, login,verify } from './backend.jsx';
import check from './check.jsx';
import './index.css'
const Create = ({ newEmail, upMail, newPassConf, upPassConf, setState, newUser, newPass, error, upUse, upPass, setError, usernam }) => {
  
  const errors = [
    'Please type a username', 'Your username is not available', 'Your username must only have letters', "You're email is not available", 
    'Please make sure to have \na proper email', 'Your username must be appropriate', 'Your password must be \n between 5-25 characters', 
    'Your password must contain a 3 symbols', 'Your password must \n contain the word cow', 'Your password must be appropriate', 
    'Loading...', 'Account created! Please Verify Email', 'Error in creating account. \n Please check info then retry...'
  ];
  const navigate = useNavigate();
  
  const [res, setRes] = useState('N');
  const [disable,setDisable]=useState(false)
  const [send,setSend]=useState(false)
  async function handleSubmit(event) {
    event.preventDefault();
    setError(10);
    
    const t = await insert({
      col: 'users', 
      data: {
        "username": newUser,
        "verified":false,
        "email": newEmail,
        "emailVisibility": true,
        "password": newPass,
        "passwordConfirm": newPass,
        "info": {
          "answers": {},
          "points": 0,
          "streak": 0,
          "record": 0
        },
        "updates":[0]
      }
      
    });
    console.log(t)
    if (t === false) {
      setError(12);
      return;
    }
    verify({email:newEmail})
    setDisable(true)
    setError(11);
  }
  const [isChecked, setIsChecked] = useState(false);
  useEffect(()=> {check({ res, setRes, mail: newEmail, newUser, newPass, setError, usernam })},[newUser,newEmail,newPass])
  const Messages = () => {
    if (error === 13) {
        return (
            isChecked ? (
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Register
                </button>
            ) : (
                <p className="text-red-500 text-center">
                    {"Please Agree to the \n terms and conditions".split('\n').map((line, index) => (
                        <span key={index}>{line}<br /></span>
                    ))}
                </p>
            )
        );
    } else if (error === 11) {

        return (
          <div className="flex justify-center">
          <p className="text-red-500 text-center">
              {'Account Created!\nPlease Verify your Email\n Then Sign In'.split('\n').map((line, index) => (
                  <span key={index}>{line}<br /></span>
              ))}
          </p>
          <p>&nbsp;</p>
          <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
              onClick={() => {
                  setSend(true);
                  
                  setTimeout(() => {
                      setSend(false);
                  }, 30000);
                  verify({email:newEmail})
              }}
              disabled={send}
          >
              Resend Email
          </button>
      </div>
      
        );
    } else {
        return (
            <p className="text-red-500 text-center">
                {errors[error].split('\n').map((line, index) => (
                    <span key={index}>{line}<br /></span>
                ))}
            </p>
        );
    }
};

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center">Create Account</h1>
      <p className="text-center mb-4">Please enter your details to register</p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-semibold">Username:</label>
          <input className="w-full p-2 border rounded" onChange={(e) =>upUse(e.target.value)} value={newUser} disabled={disable} />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Email:</label>
          <input className="w-full p-2 border rounded" onChange={(e) => upMail(e.target.value)} value={newEmail} disabled={disable}/>
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Password:</label>
          <input className="w-full p-2 border rounded" onChange={(e) => upPass(e.target.value)} value={newPass} type="password" disabled={disable}/>
        </div>
        <div className="flex items-center mb-4">
          <input type="checkbox" id="checkbox1" name="agreement" className="mr-2"   checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)}/>
          <label htmlFor="checkbox1">I agree to the <a href="https://testforger.vercel.app/tos" className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">terms and conditions</a></label>
        </div>
        <Messages className='flex items-center mb-4'></Messages>
      </form>
      
      <p className="mt-6 text-center">
        Already have an account? &nbsp;
        <span onClick={() => setState(true)} className="text-blue-500 cursor-pointer underline">Log In</span>
      </p>
    </div>
  );
};

const Login = () => {
  const [error, setError] = useState(0);
  const navigate = useNavigate();
  console.log(error)
  const Created = () => {
    const [user, changeUser] = useState('');
    const [pass, changePass] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      const success = await login({ i: setLoading, email: user, password: pass, event: e });
      if (success) {
        navigate('/');
      } else {
        setMessage('Wrong username or password\n or have not verified email');
      }
    };

    return (
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">Welcome Back</h1>
        <p className="text-center mb-4">Please enter your details to sign in</p>
        <p className="text-center mb-4">
          Don't have an account? &nbsp;
          <span onClick={() => { setState(false); setReset(true); upUse(''); upPass(''); upMail(''); setError(0); }} className="text-blue-500 cursor-pointer underline">Create one now.</span>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-semibold">Email or Username:</label>
            <input className="w-full p-2 border rounded" onChange={() => changeUser(event.target.value)} value={user} />
          </div>
          <div className="mb-4">
            <label className="block font-semibold">Password:</label>
            <input className="w-full p-2 border rounded" type="password" onChange={() => changePass(event.target.value)} value={pass} />
          </div>
          {message && (
            <div className="flex justify-center items-center h-full">
                        <div className="text-center">
                            {message.split('\n').map((n, index) => (
                                <p key={index} className="text-red-500">
                                    {n}
                                </p>
                            ))}
                        </div>
                    </div>
          )}
          <p>&nbsp;</p>

          <div>
            {loading ? (
              <p className="text-center font-semibold">Loading...</p>
            ) : (
              <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Login</button>
            )}
          </div>
        </form>
      </div>
    );
  };

  const [state, setState] = useState(true);
  const [usernam, setUsername] = useState(null);
  const [reset, setReset] = useState(false);
  const [newUser, upUse] = useState('');
  const [newEmail, upMail] = useState('');
  const [newPass, upPass] = useState('');
  const [newPassConf, upPassConf] = useState('');

  useEffect(() => {
    async function fetchData() {
      const usernames = await getTests({ col: 'users' });
      setUsername(usernames);
    }

    if (usernam === null) {
      fetchData();
    }
  }, [usernam]);

  return (
    <div className="min-h-screen bg-[url('/login.jpg')] bg-cover bg-center bg-gray-100 flex items-center justify-center">
      {state ? <Created /> : <Create newPassConf={newPassConf} upPassConf={upPassConf} newEmail={newEmail} upMail={upMail} usernam={usernam} setState={setState} newUser={newUser} newPass={newPass} error={error} upUse={upUse} upPass={upPass} setError={setError} />}
    </div>
  );
};

export default Login;
