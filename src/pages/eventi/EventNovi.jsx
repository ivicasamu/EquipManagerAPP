import { useEffect, useState } from "react"
import { Form, Button, Row, Col, Container, Card, Table } from "react-bootstrap"
import { RouteNames } from "../../constants"
import { Link, useNavigate } from "react-router-dom"
import EventService from "../../services/eventi/EventService"
import KlijentService from "../../services/klijenti/KlijentService"
import UredjajService from "../../services/uredjaji/UredjajService"
import LoadingSpinner from "../../components/LoadingSpinner.jsx"
import useLoading from "../../hooks/useLoading"
import { ShemaEvent } from "../../schemas/ShemaEvent"
import StatusService from "../../services/statusi/StatusService"

export default function EventNovi() {

    const navigate = useNavigate()
    const [klijenti, setKlijenti] = useState([])
    const [uredjaji, setUredjaji] = useState([])
    const [odabraniUredjaji, setOdabraniUredjaji] = useState([])
    const [pretragaUredjaja, setPretragaUredjaja] = useState('')
    const [prikaziAutocomplete, setPrikaziAutocomplete] = useState(false)
    const [odabraniIndex, setOdabraniIndex] = useState(-1)
    const { showLoading, hideLoading} = useLoading()
    const [errors, setErrors] = useState({})

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

        const statusi = (await StatusService.get()).data

        const dostupanStatus = statusi.find(
            s => s.naziv.toLowerCase() === 'dostupno'
        )

        await UredjajService.get().then((odgovor) => {
            if (!odgovor.success) {
                alert('Nije implementiran servis za uređaje')
                return
            }

            const dostupniUredjaji = odgovor.data.filter(
                uredjaj => uredjaj.status === dostupanStatus.sifra
            )

            setUredjaji(dostupniUredjaji)
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
        showLoading()
        await new Promise(resolve => setTimeout(resolve, 1200))

        // 1. Spremi event
        await EventService.dodaj(event)

        // 2. Dohvati status "Iznajmljeno"
        const statusi = (await StatusService.get()).data
        const iznajmljenoStatus = statusi.find(
            s => s.naziv.toLowerCase() === 'iznajmljeno'
        )

        // 3. Promijeni status svim odabranim uređajima
        for (const uredjaj of odabraniUredjaji) {
            await UredjajService.promjeni(uredjaj.sifra, {
                ...uredjaj,
                status: iznajmljenoStatus.sifra
            })
        }
        hideLoading()
        navigate(RouteNames.EVENTI)
    }

    function odradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)

        setErrors({});
        const objektPodataka = Object.fromEntries(podaci)

        const rezultat = ShemaEvent.safeParse(objektPodataka)

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

        const odabraniKlijent = parseInt(podaci.get('klijent'));

        dodaj({
            datumPocetka: new Date(podaci.get('datumPocetka')).toISOString(),
            predvidenoTrajanje: podaci.get('predvidenoTrajanje'),
            lokacija: podaci.get('lokacija'),
            klijent: odabraniKlijent,
            uredjaji: odabraniUredjaji.map(u => u.sifra),
            napomena: podaci.get('napomena')
        })
    }

    const ocistiGresku = (nazivPolja) => {
        if (errors[nazivPolja]) {
            const noveGreske = { ...errors };
            delete noveGreske[nazivPolja];
            setErrors(noveGreske);
        }
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
                                        <Form.Control 
                                        type="date" 
                                        name="datumPocetka"
                                        isInvalid={!!errors.datumPocetka} 
                                        onFocus={() => ocistiGresku('datumPocetka')}
                                        onClick={(e) => e.target.showPicker()} 
                                        onFocus={(e) => e.target.showPicker()}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.datumPocetka}
                                        </Form.Control.Feedback>
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
                                            isInvalid={!!errors.lokacija}
                                            placeholder="Unesite lokaciju eventa"
                                            onFocus={() => ocistiGresku('datumPocetka')}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.lokacija}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group controlId="klijent" className="mb-3">
                                        <Form.Label className="fw-bold">Klijent</Form.Label>
                                        <Form.Select 
                                        name="klijent" 
                                        isInvalid={!!errors.klijent}
                                        onFocus={() => ocistiGresku('klijent')}>
                                            <option value="">Odaberite klijenta</option>
                                            {klijenti && [...klijenti]
                                                .sort((a, b) => a.naziv.localeCompare(b.naziv, 'hr'))
                                                .map((klijent) => (
                                                <option key={klijent.sifra} value={klijent.sifra}>
                                                    {klijent.naziv}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.klijent}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group controlId="napomena" className="mb-3">
                                        <Form.Label className="fw-bold">Napomena</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            name="napomena"
                                            placeholder="Unesite napomenu za event"
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
                                    Dodaj novi event
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Container>
            </Form>
        </>
    )
}
