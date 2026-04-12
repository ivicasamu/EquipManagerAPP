import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import { useEffect, useState } from "react";
import StatusService from "../../services/statusi/StatusService";

export default function StatusPromjena(){

    const navigate = useNavigate()
    const params = useParams()

    const [status, setStatus] = useState({
        naziv: "",
        opis: ""
    })

    async function ucitajStatus(){
        await StatusService.getBySifra(params.sifra).then((odgovor)=>{
            
            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }
            
            const s = odgovor.data

            console.log(s)

            setStatus({
                naziv: s.naziv || "",
                opis: s.opis || ""
            })
        })
    }

    useEffect(()=>{
        ucitajStatus()
    },[])

    async function promjeni(status){
        await StatusService.promjeni(params.sifra, status).then(()=>{
            navigate(RouteNames.STATUSI)
        })
    }

    function odradiSubmit(e){
        e.preventDefault()

        if (!status.naziv || status.naziv.trim().length === 0) {
            alert("Naziv je obavezan i ne smije sadržavati samo razmake!")
            return
        }

        if(status.naziv.trim().length < 3) {
            alert("Naziv kategorije mora imati najmanje 3 znaka!")
            return
        }

        promjeni(status)
    }

    return(
        <>
            <h3>Promjena statusa</h3>

            <Form onSubmit={odradiSubmit}>

                <Form.Group controlId="naziv">
                    <Form.Label>Naziv</Form.Label>
                    <Form.Control
                        type="text"
                        value={status.naziv}
                        onChange={(e) =>
                            setStatus({
                                ...status,
                                naziv: e.target.value
                            })
                        }
                    />
                </Form.Group>

                <Form.Group controlId="opis">
                    <Form.Label>Opis</Form.Label>
                    <Form.Control
                        type="text"
                        value={status.opis}
                        onChange={(e) =>
                            setStatus({
                                ...status,
                                opis: e.target.value
                            })
                        }
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
                            Promjeni status
                        </Button>
                    </Col>
                </Row>

            </Form>
        </>
    )
}