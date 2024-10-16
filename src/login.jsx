import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { insert, getTests, login } from './backend.jsx';
import check from './check.jsx';
import './index.css'
const Create = ({ newEmail, upMail, newPassConf, upPassConf, setState, newUser, newPass, error, upUse, upPass, setError, usernam }) => {
  
  const errors = [
    'Please type a username', 'Your username is not available', 'Your username must only have letters', "You're email is not available", 
    'Please make sure to have \na proper email', 'Your username must be appropriate', 'Your password must be \n between 5-25 characters', 
    'Your password must contain a 3 symbols', 'Your password must \n contain the word cow', 'Your password must be appropriate', 
    'Loading...', 'Account created! Please go to \nthe login page and sign in', 'Error in creating account. \n Please check info then retry...'
  ];
  const navigate = useNavigate();
  
  const [res, setRes] = useState('N');
  const [disable,setDisable]=useState(false)
  async function handleSubmit(event) {
    event.preventDefault();
    setError(10);
    
    const t = await insert({
      col: 'users', 
      data: {
        "username": newUser,
        "email": newEmail,
        "emailVisibility": true,
        "password": newPass,
        "passwordConfirm": newPass,
        "info": {
          "answers": {},
          "points": 0,
          "streak": 0,
          "record": 0
        }

      },
      updates:{[0]}
    });
    
    if (t === false) {
      setError(12);
      return;
    }
    setDisable(true)
    setError(11);
  }
  const [isChecked, setIsChecked] = useState(false);
  useEffect(()=> {check({ res, setRes, mail: newEmail, newUser, newPass, setError, usernam })},[newUser,newEmail,newPass])
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
        {error === 13 ? (
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
        ) : (
          <p className="text-red-500 text-center">
            {errors[error].split('\n').map((line, index) => (
              <span key={index}>{line}<br /></span>
            ))}
          </p>
        )}
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
        setMessage('Wrong username or password');
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
          {message && <p className="text-red-500">{message}</p>}
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
