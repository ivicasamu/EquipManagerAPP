import { Button, Card, Row, Col, Container } from "react-bootstrap"
import { FaEdit, FaTrash } from "react-icons/fa"
import { GrDislike, GrLike } from "react-icons/gr";

export default function KlijentPregledGrid({ klijenti, navigate, brisanje }) {

    return (
        <Container className="py-3 px-0">
            <Row>
                {klijenti && klijenti.map((klijent) => (

                    <Col key={klijent.sifra} xs={12} md={6} className="mb-4">
                        <Card className="shadow-sm h-100">
                            <Card.Header className="d-flex justify-content-between align-items-center bg-white py-3">
                                <span className="fw-bold text-primary" style={{ fontSize: '1.1rem' }}>
                                    {klijent.naziv}
                                </span>
                            </Card.Header>

                            <Card.Body>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">OIB:</span>
                                    <span className="fw-semibold"> {klijent.oib}</span>
                                </div>

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Adresa:</span>
                                    <span className="fw-semibold">{klijent.adresa}</span>
                                </div>

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Kontakt osoba:</span>
                                    <span className="fw-semibold">{klijent.kontaktOsoba}</span>
                                </div>

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Telefon:</span>
                                    <span className="fw-semibold">{klijent.tel}</span>
                                </div>

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Email:</span>
                                    <span className="fw-semibold">{klijent.email}</span>
                                </div>

                            </Card.Body>

                            <Card.Footer className="bg-light d-flex gap-2">
                                <Button
                                    variant="outline-primary"
                                    className="flex-fill"
                                    onClick={() => navigate(`/klijenti/${klijent.sifra}`)}
                                    title="Promjeni"
                                >
                                    <FaEdit />
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    className="flex-fill"
                                    onClick={() => brisanje(klijent.sifra)}
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