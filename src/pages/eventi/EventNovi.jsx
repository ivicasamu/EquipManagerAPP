import { useEffect, useState } from "react"
import { Form, Button, Row, Col, Container, Card, Table } from "react-bootstrap"
import { RouteNames } from "../../constants"
import { Link, useNavigate } from "react-router-dom"
import EventService from "../../services/eventi/EventService"
import KlijentService from "../../services/klijenti/KlijentService"
import UredjajService from "../../services/uredjaji/UredjajService"


export default function EventNovi() {

    const navigate = useNavigate()
    const [klijenti, setKlijenti] = useState([])
    const [uredjaji, setUredjaji] = useState([])
    const [odabraniUredjaji, setOdabraniUredjaji] = useState([])
    const [pretragaUredjaja, setPretragaUredjaja] = useState('')
    const [prikaziAutocomplete, setPrikaziAutocomplete] = useState(false)
    const [odabraniIndex, setOdabraniIndex] = useState(-1)

    useEffect(() => {
        ucitajKlijente()
        ucitajUredjaje()
    }, [])

    async function ucitajKlijente() {
        await KlijentService.get().then((odgovor) => {
            if (!odgovor.success) {
                alert('Nije implementiran servis za klijente')
                return
            }
            setKlijenti(odgovor.data)
        })
    }

    async function ucitajUredjaje() {
        await UredjajService.get().then((odgovor) => {
            if (!odgovor.success) {
                alert('Nije implementiran servis za uređaje')
                return
            }
            setUredjaji(odgovor.data)
        })
    }

    function dodajUredjaj(uredjaj) {
        if (!odabraniUredjaji.find(p => p.sifra === uredjaj.sifra)) {
            setOdabraniUredjaji([...odabraniUredjaji, uredjaj])
        }
        setPretragaUredjaja('')
        setPrikaziAutocomplete(false)
        setOdabraniIndex(-1)
    }

    function ukloniUredjaj(sifra) {
        setOdabraniUredjaji(setOdabraniUredjaji.filter(p => p.sifra !== sifra))
    }

    function filtrirajUredjaje() {
        if (!pretragaUredjaja) return []
        return uredjaji.filter(p =>
            !odabraniUredjaji.find(op => op.sifra === p.sifra) &&
            (p.model.toLowerCase().includes(pretragaUredjaja.toLowerCase()) ||
                p.serijskiBroj.toLowerCase().includes(pretragaUredjaja.toLowerCase()))
        )
    }

    function handleKeyDown(e) {
        const filtriraniUredjaji = filtrirajUredjaje()

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setOdabraniIndex(prev => {
                if (prev + 1 === filtriraniUredjaji.length) {
                    return 0
                }
                return prev < filtriraniUredjaji.length - 1 ? prev + 1 : prev
            }

            )
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setOdabraniIndex(prev => {
                if(prev===0){
                    return filtriraniUredjaji.length-1
                }
                return prev > 0 ? prev - 1 : 0
            })
        }  else if (e.key === 'Enter' && odabraniIndex >= 0 && filtriraniUredjaji.length > 0) {
            e.preventDefault()
            dodajUredjaj(filtriraniUredjaji[odabraniIndex])
        } else if (e.key === 'Escape') {
            setPrikaziAutocomplete(false)
            setOdabraniIndex(-1)
        }
    }

    async function dodaj(event) {
        await EventService.dodaj(event).then(() => {
            navigate(RouteNames.EVENTI)
        })
    }

    function odradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)

        if (!podaci.get('datumPocetka')) {
            alert("Datum početka je obavezan.");
            return;
        }

        if (!podaci.get('lokacija') || podaci.get('lokacija').trim().length === 0) {
            alert("Lokacija je obavezna i ne smije sadržavati samo razmake!");
            return;
        }

        if (podaci.get('lokacija').trim().length < 3) {
            alert("Lokacija mora imati najmanje 3 znaka!");
            return;
        }

        const odabraniKlijent = parseInt(podaci.get('klijent'));
        if (isNaN(odabraniKlijent) || odabraniKlijent <= 0) {
            alert("Odabrani klijent nije valjan!");
            return;
        }

        dodaj({
            datumPocetka: new Date(podaci.get('datumPocetka')).toISOString(),
            predvidenoTrajanje: podaci.get('predvidenoTrajanje'),
            lokacija: podaci.get('lokacija'),
            klijent: odabraniKlijent,
            napomena: podaci.get('napomena')
        })
    }

    return (
        <>
            <h3>Unos novog eventa</h3>
            <Form onSubmit={odradiSubmit}>
                <Container className="mt-4">
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-4">Podaci o eventu</Card.Title>

                            <Row>
                                <Col xs={6}>
                                    <Form.Group controlId="datumPocetka" className="mb-3">
                                        <Form.Label className="fw-bold">Datum početka</Form.Label>
                                        <Form.Control type="date" name="datumPocetka" 
                                        onClick={(e) => e.target.showPicker()} 
                                        onFocus={(e) => e.target.showPicker()}
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="predvidenoTrajanje" className="mb-3">
                                        <Form.Label className="fw-bold">Predviđeno trajanje</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="predvidenoTrajanje"
                                            placeholder="Unesite predviđeno trajanje eventa"
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="lokacija" className="mb-3">
                                        <Form.Label className="fw-bold">Lokacija eventa:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="lokacija"
                                            placeholder="Unesite lokaciju eventa"
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="klijent" className="mb-3">
                                        <Form.Label className="fw-bold">Klijent</Form.Label>
                                        <Form.Select name="klijent" required>
                                            <option value="">Odaberite klijenta</option>
                                            {klijenti && [...klijenti]
                                                .sort((a, b) => a.naziv.localeCompare(b.naziv, 'hr'))
                                                .map((klijent) => (
                                                <option key={klijent.sifra} value={klijent.sifra}>
                                                    {klijent.naziv}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group controlId="napomena" className="mb-3">
                                        <Form.Label className="fw-bold">Napomena</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            name="napomena"
                                            placeholder="Unesite napomenu za uređaj"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col xs={6}>
                                    <Card className="shadow-sm">
                                        <Card.Body>
                                            <Card.Title className="mb-4">Uređaji</Card.Title>

                                            <Form.Group className="mb-3 position-relative">
                                                <Form.Label className="fw-bold">Dodaj uređaj</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Pretraži uređaje..."
                                                    value={pretragaUredjaja}
                                                    onChange={(e) => {
                                                        setPretragaUredjaja(e.target.value)
                                                        setPrikaziAutocomplete(e.target.value.length > 0)
                                                        setOdabraniIndex(-1)
                                                    }}
                                                    onFocus={() => setPrikaziAutocomplete(pretragaUredjaja.length > 0)}
                                                    onKeyDown={handleKeyDown}
                                                />
                                                {prikaziAutocomplete && filtrirajUredjaje().length > 0 && (
                                                    <div className="position-absolute w-100 bg-white border rounded shadow-sm" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                                                        {filtrirajUredjaje().map((uredjaj, index) => (
                                                            <div
                                                                key={uredjaj.sifra}
                                                                className="p-2 cursor-pointer"
                                                                style={{
                                                                    cursor: 'pointer',
                                                                    backgroundColor: index === odabraniIndex ? '#007bff' : 'white',
                                                                    color: index === odabraniIndex ? 'white' : 'black'
                                                                }}
                                                                onClick={() => dodajUredjaj(uredjaj)}
                                                                onMouseEnter={(e) => {
                                                                    setOdabraniIndex(index)
                                                                }}
                                                            >
                                                                {uredjaj.model}, (sn: {uredjaj.serijskiBroj})
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </Form.Group>

                                            {odabraniUredjaji.length > 0 && (
                                                <div style={{overflow: 'auto', maxHeight: '300px'}}>
                                                    <Table striped bordered hover size="sm">
                                                        <thead>
                                                            <tr>
                                                                <th>Model i serijski broj</th>
                                                                <th style={{ width: '80px' }}>Akcija</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {odabraniUredjaji.map(uredjaj => (
                                                                <tr key={uredjaj.sifra}>
                                                                    <td>{uredjaj.model} - {uredjaj.serijskiBroj}</td>
                                                                    <td>
                                                                        <Button
                                                                            variant="danger"
                                                                            size="sm"
                                                                            onClick={() => ukloniUredjaj(uredjaj.sifra)}
                                                                        >
                                                                            Obriši
                                                                        </Button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </Table>
                                                </div>

                                            )}
                                            {odabraniUredjaji.length === 0 && (
                                                <p className="text-muted">Nema odabranih uređaja</p>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            <hr />

                            {/* Gumbi za akciju */}
                            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                <Link to={RouteNames.EVENTI} className="btn btn-danger px-4">
                                    Odustani
                                </Link>
                                <Button type="submit" variant="success">
                                    Dodaj novu grupu
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Container>
            </Form>
        </>
    )
}
