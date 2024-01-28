import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Button } from '../'

export function NavBar( {onClickDraftNavbar, onClickStatNavbar}) {
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