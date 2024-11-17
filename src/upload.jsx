import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { insert, getState, getTests } from './backend.jsx';
import Bar from './bar.jsx';

async function checks({ name, text, setMessage, files, userData }) {
  if (text.length > 1000) {
    setMessage('Text is too long');
  } else if (/^[a-z]+$/.test(name) === false) {
    setMessage('Name must be of lowercase letters');
  } else if (files.some(n => n.Name === name)) {
    setMessage('Name is taken');
  } else {
    await insert({ col: 'Files', data: { Name: name, Text: text, Author: userData.username } });
    setMessage(`File uploaded. You can access it using this link: https://testforger.vercel.app/upload?p=${name}`);
  }
}

async function getFiles({ setFiles }) {
  const temp = await getTests({ col: 'Files' });
  setFiles(temp);
}

const Tools = () => {
  const navigate = useNavigate();
  const [userData, setUser] = useState(null);
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState(null);
  const [files, setFiles] = useState([]);
  const [code, setCode] = useState('');

  const params = new URLSearchParams(window.location.search);

  useEffect(() => {
    if (userData === null) {
      if (params.get('p') != null) {
        setCode(params.get('p'));
      }
      const temp = getState();
      if (temp === false) {
        navigate('/?signedIn=0');
      } else {
        setUser(temp);
      }
    }
  }, [userData, navigate]);

  useEffect(() => {
    if (files.length === 0) {
      getFiles({ setFiles });
    }
  }, [files]);

  return (
    <div className="flex flex-col justify-center bg-gray-50">
      <Bar user={userData} />
      
      <h1 className="text-5xl font-extrabold text-red-600 mb-6 leading-tight">Find Text Files</h1>
      
      <input
        type="text"
        placeholder="Type Code"
        value={code || ''}
        onChange={(e) => setCode(e.target.value)}
        className="w-full max-w-md p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      {files.length === 0 ? (
  "Loading..."
) : (
  files.some(n => n.Name === code) && (
    <div className="bg-white shadow-md p-4 rounded-lg max-w-md w-full text-center mb-6">
      <p><strong>Author:</strong> {files.find(n => n.Name === code).Author}</p>
      <p>{files.find(n => n.Name === code).Text}</p>
    </div>
  )
)}


      <h1 className="text-5xl font-extrabold text-red-600 mb-6 leading-tight">Upload Your Text Files</h1>
      
      <form
        onSubmit={(e) => {
          e.preventDefault();
          checks({ name, text, setMessage, files, userData });
        }}
        className="w-full max-w-md bg-white p-6 shadow-lg rounded-lg"
      >
        <textarea
          id="response"
          name="response"
          rows="5"
          placeholder="Type your Text Here Diddy"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        
        <input
          type="text"
          placeholder="Type Your Code Here"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </form>

      {message && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg max-w-md">
          {message}
        </div>
      )}
    </div>
  );
};

export default Tools;
