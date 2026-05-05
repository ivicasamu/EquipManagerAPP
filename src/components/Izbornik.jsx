import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap"
import { IME_APLIKACIJE, RouteNames } from "../constants"
import { useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth.js"

export default function Izbornik() {

    const navigate = useNavigate()
    const { isLoggedIn, logout, authUser } = useAuth()
    const isAdmin = authUser?.administrator

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand>{IME_APLIKACIJE}</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {isLoggedIn &&(
                            <>
                            {!isAdmin ? (
                                <Nav.Link
                                    onClick={()=>navigate(RouteNames.HOME)}
                                >POČETNA</Nav.Link>
                            ):(
                                    <Nav.Link
                                        onClick={()=>navigate(RouteNames.NADZORNA_PLOCA)}
                                    >NADZORNA PLOČA</Nav.Link>
                                )}
                                <Nav.Link
                                    onClick={()=>navigate(RouteNames.UREDJAJI)}
                                >UREĐAJI</Nav.Link>

                                <Nav.Link
                                    onClick={()=>navigate(RouteNames.EVENTI)}
                                >EVENTI</Nav.Link>

                                {!isAdmin &&(
                                    <Nav.Link
                                        onClick={()=>navigate(RouteNames.KLIJENTI)}
                                    >KLIJENTI</Nav.Link>
                                )}

                                {isAdmin &&(
                                    <NavDropdown title="ADMINISTRACIJA" id="basic-nav-dropdown">
                                        <NavDropdown.Item onClick={()=>navigate(RouteNames.KLIJENTI)}>KLIJENTI</NavDropdown.Item>
                                        <NavDropdown.Item onClick={()=>navigate(RouteNames.KORISNICI)}>KORISNICI</NavDropdown.Item>
                                        <NavDropdown.Item onClick={()=>navigate(RouteNames.KATEGORIJE)}>KATEGORIJE</NavDropdown.Item>
                                        <NavDropdown.Item onClick={()=>navigate(RouteNames.STATUSI)}>STATUSI</NavDropdown.Item>
                                        <hr />
                                        <NavDropdown.Item onClick={()=>navigate(RouteNames.GENERIRANJE_PODATAKA)}>GENERIRANJE PODATAKA</NavDropdown.Item>
                                    </NavDropdown>
                                )}
                            </>

                        )}

                        
                    </Nav>

                    <Nav className="ms-auto">
                        {isLoggedIn ? (
                            <Button
                                className="me-2"
                                onClick={() => logout()}
                            >Logout {authUser.korisnickoIme}</Button>
                        ) : (
                            <>
                                <Button
                                    className="me-2"
                                    onClick={() => navigate(RouteNames.REGISTRACIJA)}
                                >Registracija</Button>
                                <Button
                                    onClick={() => navigate(RouteNames.LOGIN)}
                                >Login</Button>
                            </>)}
                    </Nav>

                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}