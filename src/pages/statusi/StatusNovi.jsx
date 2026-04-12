import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import StatusService from "../../services/statusi/StatusService";

export default function StatusNovi(){

    const navigate = useNavigate()

    async function dodaj(status){
        // console.table(kategorija)
        await StatusService.dodaj(status).then(()=>{
            navigate(RouteNames.STATUSI)
        })
    }

    function odradiSubmit(e){
        e.preventDefault()
        const podaci = new FormData(e.target)
        // console.log(podaci.get('aktivna'))

        if (!podaci.get('naziv') || podaci.get('naziv').trim().length === 0) {
            alert("Naziv je obavezan i ne smije sadržavati samo razmake!")
            return // Prekid
        }

        if(podaci.get('naziv').trim().length < 3) {
            alert("Naziv kategorije mora imati najmanje 3 znaka!")
            return
        }

        dodaj({
            naziv: podaci.get('naziv'),
            opis: podaci.get('opis'),
        })
    }

    return(
        <>
            <h3>Unos novog statusa::</h3>
            <Form onSubmit={odradiSubmit}>
                <Form.Group controlId="ime">
                    <Form.Label>Naziv</Form.Label>
                    <Form.Control type="text" name="naziv"/>
                </Form.Group>

                <Form.Group controlId="opis">
                    <Form.Label>Opis</Form.Label>
                    <Form.Control type="text" name="opis"/>
                </Form.Group>
                

                <hr style={{marginTop: '50px', border:'0'}} />

                <Row>
                    <Col>
                        <Link to={RouteNames.STATUSI} className="btn btn-danger">
                            Odustani
                        </Link>
                    </Col>
                    <Col>
                        <Button type="submit" variant="success">
                            Dodaj novi status
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}