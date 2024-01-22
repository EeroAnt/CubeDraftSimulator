import { useState, useEffect } from 'react'
import Form from './Components/Form.jsx'
import Buttons from './Components/Buttons.jsx'
function App() {
  
  return (
    <>
	  <h1>Simulator</h1>
	  <Form name="test" onChange={() => console.log('so it begins')}/>
	  <Buttons.Button name="test" onClick={() => console.log('so it begins')}/>
	</>
  )
}

export default App
