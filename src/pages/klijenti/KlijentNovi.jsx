import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import KlijentService from "../../services/klijenti/KlijentService";

export default function KlijentNovi(){

    const navigate = useNavigate()

    async function dodaj(klijent){
        // console.table(klijent)
        await KlijentService.dodaj(klijent).then(()=>{
            navigate(RouteNames.KLIJENTI)
        })
    }

    function odradiSubmit(e){
        e.preventDefault()
        const podaci = new FormData(e.target)
        console.log(podaci.get('naziv').trim().length)

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

        dodaj({
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
                            <Form.Control type="text" name="naziv"/>
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group controlId="adresa" className="mb-3">
                            <Form.Label>Adresa</Form.Label>
                            <Form.Control type="text" name="adresa" />
                        </Form.Group> 
                    </Col>

                    

                    <Col md={6}>
                        <Form.Group controlId="oib" className="mb-3">
                            <Form.Label>OIB</Form.Label>
                            <Form.Control type="text" name="oib" />
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group controlId="kontaktOsoba" className="mb-3">
                            <Form.Label>Kontakt osoba</Form.Label>
                            <Form.Control type="text" name="kontaktOsoba" />
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group controlId="tel" className="mb-3">
                            <Form.Label>Telefon</Form.Label>
                            <Form.Control type="text" name="tel" />
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group controlId="email" className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" />
                        </Form.Group>
                    </Col>
                    
                </Row>   

                <hr style={{marginTop: '30px', border:'0'}} />

                <Row>
                    <Col>
                        <Link to={RouteNames.KLIJENTI} className="btn btn-danger">
                            Odustani
                        </Link>
                    </Col>
                    <Col>
                        <Button type="submit" variant="success">
                            Dodaj novog klijenta
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}