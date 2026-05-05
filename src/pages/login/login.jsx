import { Form, Button, Row, Col, Container, Card } from "react-bootstrap"
import { RouteNames } from "../../constants"
import { useNavigate } from "react-router-dom"
import { ShemaLogin } from "../../schemas/ShemaKorisnik"
import { useState } from "react"
import useAuth from "../../hooks/useAuth"

export default function Login() {

    const navigate = useNavigate()
    const [errors, setErrors] = useState({})

    const { login } = useAuth();

    function odradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)

        setErrors({})

        const rezultat = ShemaLogin.safeParse({
            ime: podaci.get('ime'),
            prezime: podaci.get('prezime'),
            email: podaci.get('email'),
            korisnickoIme: podaci.get('korisnickoIme'),
            lozinka: podaci.get('lozinka')
        })

        if (!rezultat.success) {
            setErrors({ korisnickoIme: 'Kombinacija korisnicko ime i lozinka ne odgovaraju' })
            return
        }

        login(podaci.get('korisnickoIme'), podaci.get('lozinka'))
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
                            <Card.Title className="mb-4">Podaci za prijavu</Card.Title>
                             
                            {errors.opce && (
                                <div className="alert alert-danger" role="alert">
                                    {errors.opce}
                                </div>
                            )}

                            <Row>
                                <Col xs={12}>
                                    <Form.Group controlId="email" className="mb-3">
                                        <Form.Label className="fw-bold">Korisničko ime</Form.Label>
                                        <Form.Control
                                            type="string"
                                            name="korisnickoIme"
                                            placeholder="Unesite korisničko ime:"
                                            isInvalid={!!errors.korisnickoIme}
                                            onFocus={() => ocistiGresku('korisnickoIme')}
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
                </Container>
            </Form>
        </>
    )
}