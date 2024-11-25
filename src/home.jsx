import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import { getTests, getState } from './backend.jsx';
import Bar from './bar.jsx';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const urlParams = new URLSearchParams(window.location.search);
  const [visible, setVisible] = useState(false);
  const [userCount, setUserCount] = useState(32);
  const userCountDisplayRef = useRef(null);
  
  useEffect(() => {
    if (user === null) {
      const temp = getState();
      if (temp === false) {
        const myParam = urlParams.get('signedIn');
        if (myParam !== null) {
          if (myParam===0){
            setMessage('Please Sign In \n Before Using Services');
          }else{
            setMessage('Invalid Link');
          }
          setVisible(true);
          setTimeout(() => setVisible(false), 2000); 
          setTimeout(() => setMessage(null), 3000);
        }
      } else {
        setUser(temp);
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    async function getCount() {
      const t = await getTests({ col: 'users' });
      setUserCount(t.length);
    }
    getCount();
  }, []);

  // Intersection Observer to detect when the section is in view
  useEffect(() => {
    const displayElement = userCountDisplayRef.current;
    let count = 0;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const interval = setInterval(() => {
            if (count < userCount) {
              count++;
              displayElement.textContent = count;
            } else {
              clearInterval(interval);
            }
          }, 85); // Adjust speed here
          observer.unobserve(entry.target);  // Stop observing after counting starts
        }
      });
    }, {
      root: null, // Uses the viewport as the default root
      threshold: 0.1 // Trigger when 10% of the section is visible
    });

    const targetSection = document.getElementById('userCountSection');
    if (targetSection) {
      observer.observe(targetSection);  // Start observing the section
    }

    return () => {
      if (targetSection) {
        observer.unobserve(targetSection); // Cleanup observer on unmount
      }
    };
  }, [userCount]);

  return (
    <body className="bg-black font-sans">

      
      {message != null && 
        <div className={`text-black-500 bg-red-400 text-xl border-solid border-2 border-red-700 rounded-md p-5 mb-2 fixed top-0 left-1/2 transform -translate-x-1/2 z-10 font-bold transition-all duration-500 ease-in-out ${visible ? 'opacity-100' : 'opacity-0'}`}>
          {message}
        </div>
      }

      <Bar user={user} />
  <section className="relative h-screen flex items-center justify-center text-center bg-black text-white" style={{ fontFamily: "'Inter', sans-serif'" }}>
    <div className="w-full px-6 flex flex-col items-center justify-center h-full pt-0">

    <h1 className="text-5xl md:text-8xl font-extrabold mb-10 bg-clip-text text-transparent bg-gradient-to-r from-pink-100 to-purple-100">
      TESTFORGE
    </h1>

    <p className="text-lg md:text-3xl mb-12 max-w-[700px] mx-auto leading-snug whitespace-normal">
      Free AI Practice Test Maker with <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
        flashcards and quizzes 
      </span> 
      &nbsp;that will help you ace your tests.
    </p>

    
    <a href={user === null ? "/login" : "/guides"} 
       className="bg-white text-black font-bold text-xl py-4 px-10 rounded-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
       style={{ boxShadow: "0 0 30px rgba(128, 0, 255, 0.8)" }}>
      Get Started
    </a>
    <p className="mt-40 text-gray-600 text-sm self-end">Design inspired by Usaco Guide</p>
  </div>
</section>






          <section className="relative bg-gray-300 text-lg py-20 px-8 text-black">
          <div className="flex flex-col items-center text-lg space-y-4">
              <div 
                className="cursor-pointer p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition ease-in-out duration-300"
                onClick={() => navigate('/guides')}
              >
                <p className="text-lg font-semibold text-gray-800 ">Guides</p>
                <p className="text-sm text-gray-600">Explore and generate comprehensive guides to enhance your skills.</p>
              </div>
              <div 
                className="cursor-pointer p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition ease-in-out duration-300"
                onClick={() => navigate('/puzzle')}
              >
                <p className="text-lg font-semibold text-gray-800">Daily Puzzle</p>
                <p className="text-sm text-gray-600">Challenge yourself with our daily puzzles and improve your problem-solving skills.</p>
              </div>
              <div 
                className="cursor-pointer p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition ease-in-out duration-300"
                onClick={() => navigate('/upload')}
              >
                <p className="text-lg font-semibold text-gray-800">Upload Files</p>
                <p className="text-sm text-gray-600">Share your Text Files with Custom Links</p>
              </div>
              <div 
                className="cursor-pointer p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition ease-in-out duration-300"
                onClick={() => navigate('/rush/main')}
              >
                <p className="text-lg font-semibold text-gray-800">Rush</p>
                <p className="text-sm text-gray-600">Test your speed and agility with our Rush mode challenges.</p>
              </div>
              <div 
                className="cursor-pointer p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition ease-in-out duration-300"
                onClick={() => navigate('/place')}
              >
                <p className="text-lg font-semibold text-gray-800">Place</p>
                <p className="text-sm text-gray-600">Copied from r/place on Reddit. You can place pixels on a community board every 30 seconds.</p>
              </div>
            </div>

          </section>
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-6 text-center">
              <h2 className="text-3xl font-bold mb-8">What Our Clients Say</h2>
              <div className="relative flex flex-wrap justify-center">
                <div className="w-full md:w-1/3 px-4 mb-8">
                  <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
                    <p className="text-gray-700 mb-4">
                      "I just signed up/looked at some of the new features.. looks super super cool. Really impressive how much progress you made"
                    </p>
                    <p className="font-semibold text-lg">Anonymous</p>
                    <p className="text-gray-500">Student</p>
                  </div>
                </div>
                <div className="w-full md:w-1/3 px-4 mb-8">
                  <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
                    <p className="text-gray-700 mb-4">
                      "Nice."
                    </p>
                    <p className="font-semibold text-lg">Jay B.</p>
                    <p className="text-gray-500">Student</p>
                  </div>
                </div>
                <div className="w-full md:w-1/3 px-4 mb-8">
                  <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
                    <p className="text-gray-700 mb-4">
                      "That's cool. Its like an AI version of my studier app."
                    </p>
                    <p className="font-semibold text-lg">Nv7</p>
                    <p className="text-gray-500">Web developer</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

      <section id="userCountSection" className="relative flex items-center justify-center text-center bg-black text-white p-20" style={{ fontFamily: "'Inter', sans-serif'" }}>
        <div className="w-full px-6 flex flex-col items-center justify-center h-full pt-0">
          <h1 ref={userCountDisplayRef} className="text-blue-500 text-9xl font-bold mb-2 glow">
            0
          </h1>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-10 bg-clip-text text-transparent bg-gradient-to-r from-pink-100 to-purple-100">
            Users and counting
          </h2>
          {user === null && <a href="/login" className="bg-yellow-500 text-gray-800 py-2 px-6 rounded hover:bg-yellow-400">Sign In Now</a>}
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-6 text-center">
        <div className="container mx-auto px-6">
          <p>Thank you to William Feng, Nischant, and Dhruv Saini for helping me out. For any questions DM 'mamap' on Discord</p>
        </div>
      </footer>
    </body>
  );
};

export default Home;


