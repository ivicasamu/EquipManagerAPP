import { Button, Col, Form, Row } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import KategorijaService from "../../services/kategorije/KategorijaService"
import { ShemaKategorija } from "../../schemas/ShemaKategorija"
import { useState } from "react"

export default function KategorijaNovi(){

    const navigate = useNavigate()
    const [errors, setErrors] = useState({})

    async function dodaj(kategorija){
        // console.table(kategorija)
        await KategorijaService.dodaj(kategorija).then(()=>{
            navigate(RouteNames.KATEGORIJE)
        })
    }

    function odradiSubmit(e){
        e.preventDefault()
        const podaci = new FormData(e.target)
        
        setErrors({});
        const objektPodataka = Object.fromEntries(podaci);

        const rezultat = ShemaKategorija.safeParse(objektPodataka);

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
            aktivna: podaci.get('aktivna') === 'on'
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
            <h3>Unos nove kategorije:</h3>
            <Form onSubmit={odradiSubmit}>
                <Form.Group controlId="ime">
                    <Form.Label>Naziv</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="naziv" 
                        isInvalid={!!errors.naziv}
                        onChange={() => ocistiGresku('naziv')} 
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.naziv}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="aktivna" className="mb-3 mt-md-3">
                    <Form.Check
                        type="switch"
                        label="Kategorija je aktivna"
                        name="aktivna"
                        className="fs-5"
                    />
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