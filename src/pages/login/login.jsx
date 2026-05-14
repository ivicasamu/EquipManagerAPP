import { Form, Button, Row, Col, Container, Card } from "react-bootstrap"
import { RouteNames } from "../../constants"
import { useNavigate } from "react-router-dom"
import { ShemaLogin } from "../../schemas/ShemaKorisnik"
import { useRef, useState } from "react"
import useAuth from "../../hooks/useAuth"
import { BiFontSize } from "react-icons/bi"

export default function Login() {

    const navigate = useNavigate()
    const [errors, setErrors] = useState({})

    const formaRef = useRef(null)

    const { login } = useAuth()

    function odradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)

        setErrors({})

        const rezultat = ShemaLogin.safeParse({
            korisnickoIme: podaci.get('korisnickoIme'),
            lozinka: podaci.get('lozinka')
        })

        if (!rezultat.success) {
            setErrors({ korisnickoIme: 'Kombinacija korisnicko ime i lozinka ne odgovaraju' })
            return
        }

        login(podaci.get('korisnickoIme'), podaci.get('lozinka'))
    }

    const popuniPodatke = (korisnickoIme, lozinka) => {
        const forma = formaRef.current;
        forma.korisnickoIme.value = korisnickoIme;
        forma.lozinka.value = lozinka;
        // Čistimo greške ako su postojale
        setErrors({});
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
            <Container className="mt-4">
                <Row className="mb-3">
                    <Col md={6}>
                        <Card 
                            className="p-2 mb-2 bg-light border-dashed cursor-pointer text-center" 
                            style={{ cursor: 'pointer', borderStyle: 'dashed' }}
                            onClick={() => popuniPodatke('admin', 'Test123.')}
                        >
                            <small className="text-muted">Klikni za Admina</small>
                            <div className="fw-bold">admin</div>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card 
                            className="p-2 mb-2 bg-light border-dashed cursor-pointer text-center" 
                            style={{ cursor: 'pointer', borderStyle: 'dashed' }}
                            onClick={() => popuniPodatke('user', 'Test123.')}
                        >
                            <small className="text-muted">Klikni za Usera</small>
                            <div className="fw-bold">user</div>
                        </Card>
                    </Col>
                </Row>
                <Form onSubmit={odradiSubmit} ref={formaRef}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-4">Podaci za prijavu</Card.Title>
                                <Row>
                                    <Col xs={12}>
                                        <Form.Group controlId="korisnickoIme" className="mb-3">
                                            <Form.Label className="fw-bold">Korisničko ime</Form.Label>
                                            <Form.Control
                                                type="string"
                                                name="korisnickoIme"
                                                placeholder="Unesite korisničko ime:"
                                                isInvalid={!!errors.korisnickoIme}
                                                onFocus={() => ocistiGresku('korisnickoIme')}
                                                autoComplete="korisnickoIme"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.korisnickoIme}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col xs={12}>
                                        <Form.Group controlId="lozinka" className="mb-3">
                                            <Form.Label className="fw-bold">Lozinka</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="lozinka"
                                                placeholder="Unesite lozinku"
                                                isInvalid={!!errors.lozinka}
                                                onFocus={() => ocistiGresku('lozinka')}
                                                autoComplete="current-password"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.lozinka}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <hr />

                                <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                    <Button 
                                        type="submit" 
                                        variant="success"
                                        className="px-4"
                                    >
                                        Prijavi se
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Form>
                </Container>
        </>
    )
}