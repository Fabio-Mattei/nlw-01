//import React, {useState} from 'react';
import React from 'react';
import './App.css';

// JSX: Sintaxe de XML dentro do JavaScript

//import Header from './Header';
//import Home from './pages/Home';
import Routes from './routes';
//import CreatePoint from './pages/CreatePoint';

function App() {
  return(
    <Routes/>
  );
  // return React.createElement('h1',{
  //   children: 'Hello'
  // });
  // const [counter, setCounter] = useState(0);

  // function handleButtonClick(){
  //   setCounter(counter + 1);
  // }

  // return (
  //   <div>
  //     <Header title="Hello World"/>

  //     <h1>{counter}</h1>
  //     <button type="button" onClick={handleButtonClick}>Aumentar</button>
  //   </div>
  // );
}

export default App;
