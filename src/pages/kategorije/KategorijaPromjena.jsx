import { Button, Col, Form, Row } from "react-bootstrap"
import { Link, useNavigate, useParams } from "react-router-dom"
import { RouteNames } from "../../constants"
import { useEffect, useState } from "react"
import KategorijaService from "../../services/kategorije/KategorijaService"
import { ShemaKategorija } from "../../schemas/ShemaKategorija"


export default function KorisnikPromjena(){

    const navigate = useNavigate()
    const params = useParams()
    const [errors, setErrors] = useState({})

    const [kategorija, setKategorija] = useState({
        naziv: "",
        aktivna: false
    })

    async function ucitajKategoriju(){
        await KategorijaService.getBySifra(params.sifra).then((odgovor)=>{
            
            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }
            
            const s = odgovor.data

            console.log(s)

            setKategorija({
                naziv: s.naziv || "",
                aktivna: !!s.aktivna // uvijek boolean
            })
        })
    }

    useEffect(()=>{
        ucitajKategoriju()
    },[])

    async function promjeni(kategorija){
        await KategorijaService.promjeni(params.sifra, kategorija).then(()=>{
            navigate(RouteNames.KATEGORIJE)
        })
    }

    function odradiSubmit(e){
        e.preventDefault()

        setErrors({})

        const rezultat = ShemaKategorija.safeParse(kategorija)

        if (!rezultat.success) {
            const noveGreske = {}

            rezultat.error.issues.forEach((issue) => {
                const kljuc = issue.path[0]
                if (!noveGreske[kljuc]) {
                    noveGreske[kljuc] = issue.message
                }
            })

            setErrors(noveGreske)
            return
        }

        promjeni(kategorija)
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
            <h3>Promjena kategorije</h3>

            <Form onSubmit={odradiSubmit}>

                <Form.Group controlId="naziv">
                    <Form.Label>Naziv</Form.Label>
                    <Form.Control
                        type="text"
                        value={kategorija.naziv || ''}
                        isInvalid={!!errors.naziv}
                        onChange={(e) => {
                            ocistiGresku('naziv')
                            setKategorija({
                                ...kategorija,
                                naziv: e.target.value
                            })
                        }}
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
                        checked={kategorija.aktivna}
                        className="fs-5"
                        onChange={(e) =>
                            setKategorija({
                                ...kategorija,
                                aktivna: e.target.checked
                            })
                        }
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
                            Promjeni kategoriju
                        </Button>
                    </Col>
                </Row>

            </Form>
        </>
    )
}