import { Button, Col, Form, Row } from "react-bootstrap"
import { Link, useNavigate, useParams } from "react-router-dom"
import { RouteNames } from "../../constants"
import KorisnikService from "../../services/korisnici/KorisnikService"
import { useEffect, useState } from "react"
import { ShemaKorisnik } from "../../schemas/ShemaKorisnik"

export default function KorisnikPromjena(){

    const navigate = useNavigate()
    const params = useParams()
    const [korisnik, setKorisnik] = useState({})
    const [administrator, setAdministrator] = useState(false)
    const [errors, setErrors] = useState({})

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
        
        setErrors({});
        const objektPodataka = Object.fromEntries(podaci.entries())

        const rezultat = ShemaKorisnik.safeParse(objektPodataka)

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

        promjeni({
            ime: podaci.get('ime'),
            prezime: podaci.get('prezime'),
            email: podaci.get('email'),
            administrator: korisnik.administrator
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
                                defaultValue={korisnik.ime} 
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
                                defaultValue={korisnik.prezime} 
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
                                defaultValue={korisnik.email} 
                                isInvalid={!!errors.email}
                                onChange={() => ocistiGresku('email')}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                        <Form.Group controlId="administrator" className="mb-3 mt-md-3">
                            <Form.Check
                                type="switch"
                                label="Korisnik je administrator"
                                name="administrator"
                                checked={korisnik.administrator || false} 
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
                        <Link to={RouteNames.KORISNICI_PROMJENA_LOZINKE.replace(':sifra', params.sifra)} className="btn btn-outline-primary ml-auto">
                            Promjena lozinke
                        </Link>
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