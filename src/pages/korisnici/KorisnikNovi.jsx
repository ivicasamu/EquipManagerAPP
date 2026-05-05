import { Button, Col, Form, Row } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import KorisnikService from "../../services/korisnici/KorisnikService"
import { ShemaKorisnik } from "../../schemas/ShemaKorisnik"
import { useState } from "react"


export default function KorisnikNovi(){

    const navigate = useNavigate()
    const [errors, setErrors] = useState({})

    async function dodaj(korisnik){
        // console.table(korisnik)
        await KorisnikService.dodaj(korisnik).then(()=>{
            navigate(RouteNames.KORISNICI)
        })
    }

    function odradiSubmit(e){
        e.preventDefault()
        const podaci = new FormData(e.target)

        setErrors({});
        const objektPodataka = Object.fromEntries(podaci);

        const rezultat = ShemaKorisnik.safeParse(objektPodataka);

        if (!rezultat.success) {
            const noveGreske = {};

            // Prolazimo kroz sve issues (probleme) koje je Zod pronašao
            rezultat.error.issues.forEach((issue) => {
                const kljuc = issue.path[0];
                if (!noveGreske[kljuc]) {
                    noveGreske[kljuc] = issue.message;
                }
            });

            setErrors(noveGreske);
            return;
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

    const ocistiGresku = (nazivPolja) => {
        if (errors[nazivPolja]) {
            const noveGreske = { ...errors };
            delete noveGreske[nazivPolja];
            setErrors(noveGreske);
        }
    }

    return(
        <>
            <h3>Unos novog korisnika:</h3>
            <Form onSubmit={odradiSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="ime" className="mb-3">
                            <Form.Label>Ime</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="ime"
                                isInvalid={!!errors.ime}
                                onChange={() => ocistiGresku('ime')}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.ime}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group controlId="prezime" className="mb-3">
                            <Form.Label>Prezime</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="prezime" 
                                isInvalid={!!errors.prezime}
                                onChange={() => ocistiGresku('prezime')}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.prezime}
                            </Form.Control.Feedback>
                        </Form.Group> 
                    </Col>

                    <Col md={6}>
                        <Form.Group controlId="email" className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                                type="email" 
                                name="email"
                                placeholder="test@test.hr"
                                isInvalid={!!errors.email}
                                onChange={() => ocistiGresku('email')} 
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group controlId="korisnickoIme" className="mb-3">
                            <Form.Label>Korisničko ime</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="korisnickoIme" 
                                isInvalid={!!errors.korisnickoIme}
                                onChange={() => ocistiGresku('korisnickoIme')}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.korisnickoIme}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group controlId="lozinka" className="mb-3">
                            <Form.Label>Lozinka</Form.Label>
                            <Form.Control 
                                type="password" 
                                name="lozinka" 
                                placeholder="Min 8 znakova, velika/mala slova, broj i znak"
                                isInvalid={!!errors.lozinka}
                                onChange={() => ocistiGresku('lozinka')}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.lozinka}
                            </Form.Control.Feedback>
                            <Form.Text className="text-muted">
                                Lozinka mora sadržavati: najmanje 8 znakova, veliko slovo, malo slovo, broj i interpukcijski znak (!@#$%^&*...)
                            </Form.Text>

                        </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                        <Form.Group controlId="aktivanadministrator" className="mb-3 mt-md-3">
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