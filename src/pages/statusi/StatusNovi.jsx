import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import StatusService from "../../services/statusi/StatusService";
import { ShemaStatus } from "../../schemas/ShemaStatus"
import { useState } from "react";

export default function StatusNovi(){

    const navigate = useNavigate()
    const [errors, setErrors] = useState({})

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

        setErrors({});
        const objektPodataka = Object.fromEntries(podaci);

        const rezultat = ShemaStatus.safeParse(objektPodataka);

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
            naziv: podaci.get('naziv'),
            opis: podaci.get('opis'),
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
            <h3>Unos novog statusa::</h3>
            <Form onSubmit={odradiSubmit}>
                <Form.Group controlId="ime">
                    <Form.Label>Naziv</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="naziv"
                        isInvalid={!!errors.naziv} 
                        onFocus={() => ocistiGresku('naziv')}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.naziv}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="opis">
                    <Form.Label>Opis</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="opis"
                    />
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