import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import KategorijaService from "../../services/kategorije/KategorijaService";

export default function KategorijaNovi(){

    const navigate = useNavigate()

    async function dodaj(kategorija){
        // console.table(kategorija)
        await KategorijaService.dodaj(kategorija).then(()=>{
            navigate(RouteNames.KATEGORIJE)
        })
    }

    function odradiSubmit(e){
        e.preventDefault()
        const podaci = new FormData(e.target)
        // console.log(podaci.get('aktivna'))
        dodaj({
            naziv: podaci.get('naziv'),
            aktivna: podaci.get('aktivna') === 'on'
        })
    }

    return(
        <>
            <h3>Unos nove kategorije:</h3>
            <Form onSubmit={odradiSubmit}>
                <Form.Group controlId="ime">
                    <Form.Label>Naziv</Form.Label>
                    <Form.Control type="text" name="naziv"/>
                </Form.Group>

                <Form.Group controlId="aktivna">
                    <Form.Check label="Aktivna" name="aktivna" />
                </Form.Group>

                <hr style={{marginTop: '50px', border:'0'}} />

                <Row>
                    <Col>
                        <Link to={RouteNames.KATEGORIJE} className="btn btn-danger">
                            Odustani
                        </Link>
                    </Col>
                    <Col>
                        <Button type="submit" variant="success">
                            Dodaj novu kategoriju
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}