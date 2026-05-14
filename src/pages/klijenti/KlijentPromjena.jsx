import { Button, Col, Form, Row } from "react-bootstrap"
import { Link, useNavigate, useParams } from "react-router-dom"
import { RouteNames } from "../../constants"
import KlijentService from "../../services/klijenti/KlijentService"
import { useEffect, useState } from "react"
import { ShemaKlijent } from "../../schemas/ShemaKlijent"

export default function KlijentPromjena(){

    const navigate = useNavigate()
    const params = useParams()
    const [klijent, setKlijent] = useState({})
    const [administrator, setAdministrator] = useState(false)
    const [errors, setErrors] = useState({})

    async function ucitajKlijenta(){
        await KlijentService.getBySifra(params.sifra).then((odgovor)=>{
            
            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }
            
            const s = odgovor.data

            setKlijent(s)
            setAdministrator(s.administrator)
        })
    }

    useEffect(()=>{
        ucitajKlijenta()
    },[])

    async function promjeni(klijent){
        await KlijentService.promjeni(params.sifra, klijent).then(()=>{
            navigate(RouteNames.KLIJENTI)
        })
    }

    function odradiSubmit(e){
        e.preventDefault()
        const podaci = new FormData(e.target)

        setErrors({});
        const objektPodataka = Object.fromEntries(podaci)

        const rezultat = ShemaKlijent.safeParse(objektPodataka)

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
            naziv: podaci.get('naziv'),
            adresa: podaci.get('adresa'),
            oib: podaci.get('oib'),
            kontaktOsoba: podaci.get('kontaktOsoba'),
            tel: podaci.get('tel'),
            email: podaci.get('email')
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
            <h3>Unos novog klijenta:</h3>
            <Form onSubmit={odradiSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="naziv" className="mb-3">
                            <Form.Label>Naziv</Form.Label>
                            <Form.Control type="text" name="naziv"
                                defaultValue={klijent.naziv}
                                isInvalid={!!errors.naziv}
                                onChange={() => ocistiGresku('naziv')} 
                            />
                            <Form.Control.Feedback type="invalid">
                            {errors.naziv}
                        </Form.Control.Feedback>
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group controlId="adresa" className="mb-3">
                            <Form.Label>Adresa</Form.Label>
                            <Form.Control type="text" name="adresa" 
                                defaultValue={klijent.adresa}
                                isInvalid={!!errors.adresa}
                                onChange={() => ocistiGresku('adresa')} 
                            /> 
                        <Form.Control.Feedback type="invalid">
                            {errors.adresa}
                        </Form.Control.Feedback>
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group controlId="oib" className="mb-3">
                            <Form.Label>OIB</Form.Label>
                            <Form.Control type="text" name="oib" 
                                defaultValue={klijent.oib}
                                isInvalid={!!errors.oib}
                                onChange={() => ocistiGresku('oib')} 
                            />
                        <Form.Control.Feedback type="invalid">
                            {errors.oib}
                        </Form.Control.Feedback>
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group controlId="kontaktOsoba" className="mb-3">
                            <Form.Label>Kontakt osoba</Form.Label>
                            <Form.Control type="text" name="kontaktOsoba" 
                                defaultValue={klijent.kontaktOsoba}
                                isInvalid={!!errors.kontaktOsoba}
                                onChange={() => ocistiGresku('kontaktOsoba')} 
                            />
                        <Form.Control.Feedback type="invalid">
                            {errors.kontaktOsoba}
                        </Form.Control.Feedback>
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group controlId="tel" className="mb-3">
                            <Form.Label>Telefon</Form.Label>
                            <Form.Control type="text" name="tel" 
                                defaultValue={klijent.tel}
                            />
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group controlId="email" className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" 
                                defaultValue={klijent.email}
                                isInvalid={!!errors.email}
                                onChange={() => ocistiGresku('email')} 
                            />
                        <Form.Control.Feedback type="invalid">
                            {errors.email}
                        </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    
                </Row>   

                <hr style={{marginTop: '50px', border:'0'}} />

                <Row>
                    <Col>
                        <Link to={RouteNames.KLIJENTI} className="btn btn-danger">
                            Odustani
                        </Link>
                    </Col>
                    <Col>
                        <Button type="submit" variant="success">
                            Promjeni klijenta
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}