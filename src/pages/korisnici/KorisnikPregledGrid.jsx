import { Button, Card, Row, Col, Container } from "react-bootstrap"
import { FaEdit, FaTrash } from "react-icons/fa"
import { GrDislike, GrLike } from "react-icons/gr";

export default function KorisnikPregledGrid({ 
    korisnici, 
    navigate, 
    obrisi }) {

    return (
        <Container className="py-3 px-0">
            <Row>
                {korisnici && korisnici.map((korisnik) => (

                    <Col key={korisnik.sifra} xs={12} md={6} className="mb-4">
                        <Card className="shadow-sm h-100">
                            <Card.Header className="d-flex justify-content-between align-items-center bg-white py-3">
                                <span className="fw-bold text-primary" style={{ fontSize: '1.1rem' }}>
                                    {korisnik.ime} {korisnik.prezime}
                                </span>
                                {(korisnik.administrator) &&
                                    <GrLike 
                                        size={20}
                                        color='green'
                                    />
                                    }
                                    {(!korisnik.administrator) &&
                                    <GrDislike 
                                        size={20}
                                        color='red'
                                    />
                                    }
                            </Card.Header>

                            <Card.Body>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Korisničko ime:</span>
                                    <span className="fw-semibold brakeAll"> {korisnik.korisnickoIme}</span>
                                </div>

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Email:</span>
                                    <span className="fw-semibold brakeAll">{korisnik.email}</span>
                                </div>

                            </Card.Body>

                            <Card.Footer className="bg-light d-flex gap-2">
                                <Button
                                    variant="outline-primary"
                                    className="flex-fill"
                                    onClick={() => navigate(`/korisnici/${korisnik.sifra}`)}
                                    title="Promjeni"
                                >
                                    <FaEdit />
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    className="flex-fill"
                                    onClick={() => brisanje(korisnik.sifra)}
                                    title="Obriši"
                                >
                                    <FaTrash />
                                </Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}