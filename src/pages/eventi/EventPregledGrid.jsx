import { Button, Card, Row, Col, Container } from "react-bootstrap"
import { FaEdit, FaPrint, FaTrash } from "react-icons/fa"
import FormatDatuma from "../../components/FormatDatuma";

export default function EventPregledGrid({ eventi, dohvatiNazivKlijenta, navigate, brisanje, generirajPDFZaEvent }) {

    function skratiTekst(tekst, max = 100) {
        if (!tekst) return '-'
        return tekst.length > max
            ? tekst.substring(0, max) + '...'
            : tekst
    }

    return (
        <Container className="py-3 px-0">
            <Row>
                {eventi && eventi.map((event) => (

                    <Col key={event.sifra} xs={12} md={6} className="mb-4">
                        <Card className="shadow-sm h-100">
                            <Card.Header className="d-flex justify-content-between align-items-center bg-white py-3">
                                <span className="fw-bold text-primary" style={{ fontSize: '1.1rem' }}>
                                    {event.lokacija}, <FormatDatuma datum={event.datumPocetka} />
                                </span>
                            </Card.Header>

                            <Card.Body>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Predviđeno trajanje:</span>
                                    <span className="fw-semibold">{event.predvidenoTrajanje}</span>
                                </div>

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Klijent:</span>
                                    <span className="fw-semibold">{dohvatiNazivKlijenta(event.klijent)}</span>
                                </div>

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Napomena:</span>
                                    <span className="fw-semibold">{skratiTekst(event.napomena, 50)}</span>
                                </div>
                            </Card.Body>

                            <Card.Footer className="bg-light d-flex gap-2">
                                <Button
                                    variant="outline-primary"
                                    className="flex-fill"
                                    onClick={() => navigate(`/eventi/${event.sifra}`)}
                                    title="Promjeni"
                                >
                                    <FaEdit />
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    className="flex-fill"
                                    onClick={() => brisanje(event.sifra)}
                                    title="Obriši"
                                >
                                    <FaTrash />
                                </Button>
                                <Button variant="info" onClick={() => generirajPDFZaEvent(event)} title="Generiraj PDF">
                                    <FaPrint />
                                </Button>

                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}