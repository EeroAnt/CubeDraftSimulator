import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Button, ManaSymbol, } from '..'
import { useState } from 'react';
import { CSVLink } from "react-csv";
import './navbar.css'

export function MyNavBar( {onClickDraftNavbar, onClickStatNavbar}) {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
		    <Button name="Draft" onClick={onClickDraftNavbar} />
		    <Button name="Statistics" onClick={onClickStatNavbar} />
		  </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export function DraftNavbar({onClickNavbar, buttonName, left, right, direction, username}) {
  const currentDirection = () =>{
	if (direction === 1) {
	  return "<="
	} else {
	  return "=>"
	}
  }
  return (
	<Navbar expand="lg" className="bg-body-tertiary">
	  <Container>
		<Navbar.Toggle aria-controls="basic-navbar-nav" />
		<Navbar.Collapse id="basic-navbar-nav">
		  <Nav className="me-auto">
		    <Button name={buttonName} onClick={onClickNavbar} />
			<div className="neighbours">
				{direction ? (`${left} ${currentDirection()} ${username} ${currentDirection()} ${right}`) : ("")}
			</div>
		  </Nav>
		</Navbar.Collapse>
	  </Container>
	</Navbar>
  );
}

export function PostDraftNavBar({admin, connection, token, deckToSubmit, username, basicLands, setBasicLands}) {
  const [draftDataDecision, setDraftDataDecision] = useState(true)


  const BasicLands = () => {
	const landTypes = ["W", "U", "B", "R", "G", "C"]
	return ( 
	  <div className="basic-lands">
		<>Basic Lands</>
		{landTypes.map((land, index) => {
		  return (
		  <> 
			<ManaSymbol key={index} symbol={land} />
			<input 
			  className='basic-land-input'
			  type="number" 
			  value={basicLands[index]} 
			  onChange={(e) => {setBasicLands(basicLands.map((value, i) => i === index ? parseInt(e.target.value) : value))}}></input>
		  </>)
		})
		}
	  </div>
	)
  }


  const handleDataDecision = (value) => {
	setDraftDataDecision(false)
	connection.sendJsonMessage({ type: "Draft Data Decision", token: token, decision: value})
  }


  return (
	<Navbar expand="lg" className="bg-body-tertiary">
	  <Container>
		<Navbar.Toggle aria-controls="basic-navbar-nav" />
		<Navbar.Collapse id="basic-navbar-nav">
		  <Nav className="me-auto">
			<CSVLink data={deckToSubmit} filename={`${username}_deck.csv`}>Download deck</CSVLink>
			{admin && draftDataDecision ? (<>
			  <Button name="Validate draft data" onClick={() => handleDataDecision(true)} />
			  <Button name="Ignore draft data" onClick={() => handleDataDecision(false)}/> 
			  </>): ""}
			{BasicLands()}
		  </Nav>
		</Navbar.Collapse>
	  </Container>
	</Navbar>
  );
}