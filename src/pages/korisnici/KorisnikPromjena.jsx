import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import KorisnikService from "../../services/korisnici/KorisnikService";
import { useEffect, useState } from "react";

export default function KorisnikPromjena(){

    const navigate = useNavigate()
    const params = useParams()
    const [korisnik, setKorisnik] = useState({})
    const [administrator, setAdministrator] = useState(false)

    async function ucitajKorisnika(){
        await KorisnikService.getBySifra(params.sifra).then((odgovor)=>{
            
            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }
            
            const s = odgovor.data

            setKorisnik(s)
            setAdministrator(s.administrator)
        })
    }

    useEffect(()=>{
        ucitajKorisnika()
    },[])

    async function promjeni(korisnik){
        await KorisnikService.promjeni(params.sifra, korisnik).then(()=>{
            navigate(RouteNames.KORISNICI)
        })
    }

    function odradiSubmit(e){
        e.preventDefault()
        const podaci = new FormData(e.target)

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

        promjeni({
            ime: podaci.get('ime'),
            prezime: podaci.get('prezime'),
            email: podaci.get('email'),
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
                            <Form.Control type="text" name="ime"
                            defaultValue={korisnik.ime} 
                            />
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group controlId="prezime" className="mb-3">
                            <Form.Label>Prezime</Form.Label>
                            <Form.Control type="text" name="prezime" 
                            defaultValue={korisnik.prezime} 
                            />
                        </Form.Group> 
                    </Col>    

                    <Col md={6}>
                        <Form.Group controlId="email" className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email"
                            defaultValue={korisnik.email} />
                        </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                        <Form.Group controlId="administrator" className="mb-3 mt-md-3">
                            <Form.Check
                                type="switch"
                                label="Korisnik je administrator"
                                name="administrator"
                                checked={korisnik.administrator}
                                className="fs-5"
                                onChange={(e) =>
                                    setKorisnik({
                                        ...korisnik,
                                        administrator: e.target.checked
                                    })
                                }
                            />
                        </Form.Group>
                    </Col>

                </Row>

                <Row className="d-grid gap-2 d-md-flex justify-content-md-left mt-4">
                    <Col md={6}>
                        <a href="" className="btn btn-outline-primary ml-auto">Promjena lozinke</a>
                    </Col>
                </Row>   

                <hr style={{marginTop: '50px', border:'0'}} />

                <Row>
                    <Col>
                        <Link to={RouteNames.KORISNICI} className="btn btn-danger">
                            Odustani
                        </Link>
                    </Col>
                    <Col>
                        <Button type="submit" variant="success">
                            Promjeni korisnika
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}