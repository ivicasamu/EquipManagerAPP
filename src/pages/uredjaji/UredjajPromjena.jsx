import { useEffect, useState } from "react"
import { Form, Button, Row, Col, Container, Card } from "react-bootstrap"
import { RouteNames } from "../../constants"
import { Link, useNavigate, useParams } from "react-router-dom"
import UredjajService from "../../services/uredjaji/UredjajService"
import KategorijaService from "../../services/kategorije/KategorijaService"
import StatusService from "../../services/statusi/StatusService"


export default function UredjajNovi() {

    const navigate = useNavigate()
    const params = useParams()
    const [uredjaj, setUredjaj] = useState([])
    const [kategorije, setKategorije] = useState([])
    const [statusi, setStatusi] = useState([])

    useEffect(() => {
        ucitajUredjaj()
        ucitajKategorije()
        ucitajStatuse()
    }, [])

    async function ucitajUredjaj() {
        await UredjajService.getBySifra(params.sifra).then((odgovor)=>{
            if (!odgovor.success) {
                alert('Nije implementiran servis')
                return
            }
            setUredjaj(odgovor.data)
        })
    }

    async function ucitajKategorije() {
        await KategorijaService.get().then((odgovor) => {
            if (!odgovor.success) {
                alert('Nije implementiran servis za kategorije')
                return
            }
            setKategorije(odgovor.data)
        })
    }

    async function ucitajStatuse() {
        await StatusService.get().then((odgovor) => {
            if (!odgovor.success) {
                alert('Nije implementiran servis za statuse')
                return
            }
            setStatusi(odgovor.data)
        })
    }

    async function promjeni(uredjaj) {
        await UredjajService.promjeni(params.sifra,uredjaj).then(()=>{
            navigate(RouteNames.UREDJAJI)
        })
    }

    function odradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)

        const odabranaKategorija = parseInt(podaci.get('kategorija'));
        if (isNaN(odabranaKategorija) || odabranaKategorija <= 0) {
            alert("Odabrana kategorija nije valjana!");
            return;
        }


        if (!podaci.get('model') || podaci.get('model').trim().length === 0) {
            alert("Model uređaja je obavezan i ne smije sadržavati samo razmake!");
            return;
        }

        if (podaci.get('model').trim().length < 3) {
            alert("Model uređaja mora imati najmanje 3 znaka!");
            return;
        }

        const odabraniStatus = parseInt(podaci.get('status'));
        if (isNaN(odabraniStatus) || odabraniStatus <= 0) {
            alert("Odabrani status nije valjan!");
            return;
        }

        promjeni({
            kategorija: odabranaKategorija,
            model: podaci.get('model'),
            serijskiBroj: podaci.get('serijskiBroj'),
            status: odabraniStatus,
            napomena: podaci.get('napomena')
        })
    }

    return (
        <>
            <h3>Unos novog uređaja</h3>
            <Form onSubmit={odradiSubmit}>
                <Container className="mt-4">
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-4">Podaci o uređaju</Card.Title>

                            <Row>
                                <Col xs={6}>
                                    <Form.Group controlId="model" className="mb-3">
                                        <Form.Label className="fw-bold">Model</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="model"
                                            placeholder="Unesite model uređaja"
                                            required
                                            defaultValue={uredjaj.model}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={6}>
                                    <Form.Group controlId="serijskiBroj" className="mb-3">
                                        <Form.Label className="fw-bold">Serijski broj</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="serijskiBroj"
                                            placeholder="Unesite serijski broj"
                                            defaultValue={uredjaj.serijskiBroj}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            
                            <Row>
                                <Col xs={6}>
                                    <Form.Group controlId="kategorija" className="mb-3">
                                        <Form.Label className="fw-bold">Kategorija</Form.Label>
                                        <Form.Select name="kategorija" required value={uredjaj.kategorija || ''} onChange={(e) => setUredjaj({...uredjaj, kategorija: parseInt(e.target.value)})}>
                                            <option value="">Odaberite kategoriju</option>
                                            {kategorije && kategorije.map((kategorija) => (
                                                <option key={kategorija.sifra} value={kategorija.sifra}>
                                                    {kategorija.naziv}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                <Col xs={6}>
                                    <Form.Group controlId="status" className="mb-3">
                                        <Form.Label className="fw-bold">Status</Form.Label>
                                        <Form.Select name="status" required value={uredjaj.status || ''} onChange={(e) => setUredjaj({...uredjaj, status: parseInt(e.target.value)})}>
                                            <option value="">Odaberite status</option>
                                            {statusi && statusi.map((status) => (
                                                <option key={status.sifra} value={status.sifra}>
                                                    {status.naziv}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            
                            <Row>
                                <Col xs={12}>
                                    <Form.Group controlId="napomena" className="mb-3">
                                        <Form.Label className="fw-bold">Napomena</Form.Label>
                                        <Form.Control
                                            type="textBox"
                                            name="napomena"
                                            placeholder="Unesite napomenu za uređaj"
                                            defaultValue={uredjaj.napomena}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>


                            <hr />

                            {/* Gumbi za akciju */}
                            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                <Link to={RouteNames.UREDJAJI} className="btn btn-danger px-4">
                                    Odustani
                                </Link>
                                <Button type="submit" variant="success">
                                    Promjeni uređaj
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Container>
            </Form>
        </>
    )
}
