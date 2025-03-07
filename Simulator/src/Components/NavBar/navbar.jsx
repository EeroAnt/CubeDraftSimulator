import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Button, ManaSymbol, } from '..'
import { useState } from 'react';
import './NavBar.css'
import { sendMessage } from '../../Services';

export function HomeNavBar({ onClickTestButton }) {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Button name="Test Button" onClick={onClickTestButton} />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export function DraftNavbar({ onClickNavbar, buttonName, left, right, direction, username }) {
  const currentDirection = () => {
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

export function PostDraftNavBar({ admin, connection, token, basicLands, setBasicLands, commanders, main, side }) {
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
                onChange={(e) => { setBasicLands(basicLands.map((value, i) => i === index ? parseInt(e.target.value) : value)) }}></input>
            </>)
        })
        }
      </div>
    )
  }


  const handleDataDecision = (value) => {
    setDraftDataDecision(false)
    const message = { type: "Draft Data Decision", token: token, decision: value }
    sendMessage(connection, message)
  }

  const copyDeckToClipBoard = () => {
    const deck = []
    commanders.forEach((commander) => {
      deck.push("1 " + commander.name)
    })
    main.forEach((card) => {
      deck.push("1 " + card.name)
    })
    basicLands.forEach((land, index) => {
      if (land > 0) {
        deck.push(land + " " + ["Plains", "Island", "Swamp", "Mountain", "Forest", "Wastes"][index])
      }
    })
    deck.push("")
    side.forEach((card) => {
      deck.push("1 " + card.name)
    })
    navigator.clipboard.writeText(deck.join("\n"))
  }

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Button name="Copy Deck to Clipboard" onClick={() => copyDeckToClipBoard()} />
            {admin && draftDataDecision ? (<>
              <Button name="Validate draft data" onClick={() => handleDataDecision(true)} />
              <Button name="Ignore draft data" onClick={() => handleDataDecision(false)} />
            </>) : ""}
            {BasicLands()}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}