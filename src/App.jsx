import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './login.jsx';
import Guides from './guides.jsx';

import Puzzle from './puzzle.jsx'

import Profile from "./profile.jsx"

import Rush from './rush.jsx'
import Home from './home.jsx'
import Amc from './amc.jsx'
import Tools from './tools.jsx'
import Image from './image.jsx'
import TOS from './tos.jsx'
import PLACE from './place.jsx'
import Upload from './upload.jsx'

function App() {
  return (
    <Router>
      <div>
        
        <Routes>
          <Route path="/login" element={<Login />} />
          {//<Route path="/home" element={<Home />} />
          }
          <Route path="/guides" element={<Guides />} />
          <Route path="/puzzle" element={<Puzzle />} />
          <Route path="/profile" element={<Profile/>} />
          
          <Route path="/rush/:mode" element={<Rush/>} />
          <Route path="/amc" element={<Amc/>} />
          <Route path="/tools" element={<Tools/>} />
          <Route path="/image" element={<Image/>} />
          <Route path="/" element={<Home/>} />
          <Route path="/tos" element={<TOS/>} />
          <Route path="/place" element={<PLACE/>} />
          <Route path="/upload" element={<Upload/>} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App
