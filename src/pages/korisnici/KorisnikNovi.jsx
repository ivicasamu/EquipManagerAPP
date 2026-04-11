import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import KorisnikService from "../../services/korisnici/KorisnikService";

export default function KorisnikNovi(){

    const navigate = useNavigate()

    async function dodaj(korisnik){
        // console.table(korisnik)
        await KorisnikService.dodaj(korisnik).then(()=>{
            navigate(RouteNames.KORISNICI)
        })
    }

    function odradiSubmit(e){
        e.preventDefault()
        const podaci = new FormData(e.target)
        console.log(podaci.get('ime').trim().length)

        if(!podaci.get('ime') || podaci.get('ime').trim().length === 0){
            alert("Ime je obavezno!")
            return
        }

        if(podaci.get('ime').trim().length < 3) {
            alert("Ime korisnika mora imati najmanje 3 znaka!")
            return
        }

        if(!podaci.get('prezime') || podaci.get('prezime').trim().length === 0){
            alert("Prezime je obavezno!")
            return
        }

        if(podaci.get('prezime').trim().length < 3) {
            alert("Prezime korisnika mora imati najmanje 3 znaka!")
            return
        }

        if(!podaci.get('korisnickoIme') || podaci.get('korisnickoIme').trim().length === 0){
            alert("Korisničko ime je obavezno!")
            return
        }

        if(podaci.get('korisnickoIme').trim().length < 3) {
            alert("Korisničko ime mora imati najmanje 3 znaka!")
            return
        }

        if(!podaci.get('lozinka') || podaci.get('lozinka').trim().length === 0){
            alert("Lozinka  je obavezna!")
            return
        }

        if(podaci.get('lozinka').trim().length != 6) {
            alert("Lozinka mora imati 6 znakova!")
            return
        }

        dodaj({
            ime: podaci.get('ime'),
            prezime: podaci.get('prezime'),
            korisnickoIme: podaci.get('korisnickoIme'),
            email: podaci.get('email'),
            lozinka: podaci.get('lozinka'),
            administrator: podaci.get('administrator') === 'on'
        })
    }

    return(
        <>
            <h3>Unos novog korisnika:</h3>
            <Form onSubmit={odradiSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="ime" className="mb-3">
                            <Form.Label>Ime</Form.Label>
                            <Form.Control type="text" name="ime"/>
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group controlId="prezimee" className="mb-3">
                            <Form.Label>Prezime</Form.Label>
                            <Form.Control type="text" name="prezime" />
                        </Form.Group> 
                    </Col>

                    

                    <Col md={6}>
                        <Form.Group controlId="korisnickoIme" className="mb-3">
                            <Form.Label>Korisničko ime</Form.Label>
                            <Form.Control type="text" name="korisnickoIme" />
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group controlId="lozinka" className="mb-3">
                            <Form.Label>Lozinka</Form.Label>
                            <Form.Control type="password" name="lozinka" />
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group controlId="email" className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" />
                        </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                        <Form.Group controlId="aktivadministratoran" className="mb-3 mt-md-3">
                            <Form.Check
                                type="switch"
                                label="Korisnik je administrator"
                                name="administrator"
                                className="fs-5"
                            />
                        </Form.Group>
                    </Col>
                </Row>   

                <hr style={{marginTop: '30px', border:'0'}} />

                <Row>
                    <Col>
                        <Link to={RouteNames.KORISNICI} className="btn btn-danger">
                            Odustani
                        </Link>
                    </Col>
                    <Col>
                        <Button type="submit" variant="success">
                            Dodaj novog korisnika
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}