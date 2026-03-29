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
        promjeni({
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
                <Form.Group controlId="ime">
                    <Form.Label>Ime</Form.Label>
                    <Form.Control type="text" name="ime"
                    defaultValue={korisnik.ime} />
                </Form.Group>

                <Form.Group controlId="imprezimee">
                    <Form.Label>Prezime</Form.Label>
                    <Form.Control type="text" name="prezime"
                    defaultValue={korisnik.prezime} />
                </Form.Group>

                <Form.Group controlId="korisnickoIme">
                    <Form.Label>Korisničko ime</Form.Label>
                    <Form.Control type="text" name="korisnickoIme" required
                    defaultValue={korisnik.korisnickoIme} />
                </Form.Group>

                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email"
                    defaultValue={korisnik.email} />
                </Form.Group>

                <Form.Group controlId="lozinka">
                    <Form.Label>Lozinka</Form.Label>
                    <Form.Control type="password" name="lozinka" required
                    defaultValue={korisnik.lozinka} />
                </Form.Group>

                <Form.Group controlId="aktivadministratoran">
                    <Form.Check label="Administrator" name="administrator"
                    checked={administrator}
                    onChange={(e)=>{setAdministrator(e.target.checked)}} />
                </Form.Group>

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