import { Form, Button, Row, Col, Container, Card } from "react-bootstrap"
import { RouteNames } from "../../constants"
import { useNavigate } from "react-router-dom"
import KorisnikService from "../../services/korisnici/KorisnikService"
import { ShemaKorisnik } from "../../schemas/ShemaKorisnik"
import { useState } from "react"

export default function Registracija() {

    const navigate = useNavigate()
    const [errors, setErrors] = useState({})

    async function registriraj(korisnik) {
        await KorisnikService.dodaj(korisnik).then(() => {
            navigate(RouteNames.LOGIN)
        })
    }

    function odradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)

        setErrors({})
        const objektPodataka = Object.fromEntries(podaci)

        // Provjera podudaranja lozinki
        if (podaci.get('lozinka') !== podaci.get('potvrdaLozinke')) {
            setErrors({ potvrdaLozinke: "Lozinke se ne podudaraju!" })
            return
        }

        // Provjera pomoću Zod sheme
        const rezultat = ShemaKorisnik.safeParse({
            ime: objektPodataka.ime,
            prezime: objektPodataka.prezime,
            email: objektPodataka.email,
            korisnickoIme: objektPodataka.korisnickoIme,
            lozinka: objektPodataka.lozinka,
            administrator: false
        })

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

        registriraj({
            ime: podaci.get('ime'),
            prezime: podaci.get('preime'),
            email: podaci.get('email'),
            korisnickoIme: podaci.get('korisnickoIme'),
            lozinka: podaci.get('lozinka'),
            administrator: false
        })
    }

    const ocistiGresku = (nazivPolja) => {
        if (errors[nazivPolja]) {
            const noveGreske = { ...errors }
            delete noveGreske[nazivPolja]
            setErrors(noveGreske)
        }
    }

    return (
        <>
            <Form onSubmit={odradiSubmit}>
                <Container className="mt-4">
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-4">Podaci za registraciju</Card.Title>

                            <Row>
                                <Col xs={12}>
                                    <Col md={6}>
                                        <Form.Group controlId="ime" className="mb-3">
                                            <Form.Label>Ime</Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                name="ime"
                                                isInvalid={!!errors.ime}
                                                onChange={() => ocistiGresku('ime')}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.ime}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group controlId="prezime" className="mb-3">
                                            <Form.Label>Prezime</Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                name="prezime" 
                                                isInvalid={!!errors.prezime}
                                                onChange={() => ocistiGresku('prezime')}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.prezime}
                                            </Form.Control.Feedback>
                                        </Form.Group> 
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group controlId="email" className="mb-3">
                                            <Form.Label className="fw-bold">Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                placeholder="vas@email.hr"
                                                isInvalid={!!errors.email}
                                                onFocus={() => ocistiGresku('email')}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.email}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>

                                    

                                    <Col md={6}>
                                        <Form.Group controlId="korisnickoIme" className="mb-3">
                                            <Form.Label>Korisničko ime</Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                name="korisnickoIme" 
                                                isInvalid={!!errors.korisnickoIme}
                                                onChange={() => ocistiGresku('korisnickoIme')}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.korisnickoIme}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group controlId="lozinka" className="mb-3">
                                            <Form.Label className="fw-bold">Lozinka</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="lozinka"
                                                placeholder="Unesite lozinku"
                                                isInvalid={!!errors.lozinka}
                                                onFocus={() => ocistiGresku('lozinka')}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.lozinka}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="potvrdaLozinke" className="mb-3">
                                            <Form.Label className="fw-bold">Potvrdi lozinku</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="potvrdaLozinke"
                                                placeholder="Ponovite lozinku"
                                                isInvalid={!!errors.potvrdaLozinke}
                                                onFocus={() => ocistiGresku('potvrdaLozinke')}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.potvrdaLozinke}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Col>
                            </Row>

                            <hr />

                            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                <Button 
                                    type="submit" 
                                    variant="success"
                                    className="px-4"
                                >
                                    Registriraj se
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Container>
            </Form>
        </>
    )
}