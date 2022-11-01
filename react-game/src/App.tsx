import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import  * as PlayStat from '../public/fb.js';
function App()  {


  useEffect(() => {
    console.log(PlayStat);
   
  })
 
  return (
    <canvas id="canvas">Flappy work</canvas>
  );
}

export default App;
