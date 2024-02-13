import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Button } from '..'

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

export function PostDraftNavBar({onClickNavbar, buttonName}) {
  return (
	<Navbar expand="lg" className="bg-body-tertiary">
	  <Container>
		<Navbar.Toggle aria-controls="basic-navbar-nav" />
		<Navbar.Collapse id="basic-navbar-nav">
		  <Nav className="me-auto">
		    <Button name={buttonName} onClick={onClickNavbar} />
		  </Nav>
		</Navbar.Collapse>
	  </Container>
	</Navbar>
  );
}