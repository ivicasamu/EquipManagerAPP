import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import KlijentService from "../../services/klijenti/KlijentService";
import { useEffect, useState } from "react";

export default function KlijentPromjena(){

    const navigate = useNavigate()
    const params = useParams()
    const [klijent, setKlijent] = useState({})
    const [administrator, setAdministrator] = useState(false)

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

        if(!podaci.get('naziv') || podaci.get('naziv').trim().length === 0){
            alert("Naziv je obavezno!")
            return
        }

        if(podaci.get('naziv').trim().length < 3) {
            alert("Naziv mora imati najmanje 3 znaka!")
            return
        }

        if(podaci.get('oib').trim().length != 11) {
            alert("OIB mora imati 11 znakova!")
            return
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
                            />
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group controlId="adresa" className="mb-3">
                            <Form.Label>Adresa</Form.Label>
                            <Form.Control type="text" name="adresa" 
                            defaultValue={klijent.adresa}
                            />
                        </Form.Group> 
                    </Col>

                    

                    <Col md={6}>
                        <Form.Group controlId="oib" className="mb-3">
                            <Form.Label>OIB</Form.Label>
                            <Form.Control type="text" name="oib" 
                            defaultValue={klijent.oib}
                            />
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group controlId="kontaktOsoba" className="mb-3">
                            <Form.Label>Kontakt osoba</Form.Label>
                            <Form.Control type="text" name="kontaktOsoba" 
                            defaultValue={klijent.kontaktOsoba}
                            />
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
                            />
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