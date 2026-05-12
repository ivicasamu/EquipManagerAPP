import { Button, Card, Row, Col, Container, Pagination, InputGroup, Form } from "react-bootstrap"
import { FaCheckCircle, FaEdit, FaPrint, FaSearch, FaTrash } from "react-icons/fa"
import FormatDatuma from "../../components/FormatDatuma";

export default function EventPregledTablica({  
    eventi, 
    dohvatiNazivKlijenta, 
    navigate, brisanje, 
    generirajPDFZaEvent, 
    totalPages, 
    currentPage, 
    handlePageChange,
    handleSearchChange,
    searchTerm,
    zavrsiEvent
}) {

    function skratiTekst(tekst, max = 100) {
        if (!tekst) return '-'
        return tekst.length > max
            ? tekst.substring(0, max) + '...'
            : tekst
    }

    return (
        <>
        <Container className="py-3 px-0">
            {/* Search input */}
            <InputGroup className="mb-3">
                <InputGroup.Text>
                    <FaSearch />
                </InputGroup.Text>
                <Form.Control
                    type="text"
                    placeholder="Pretraži evente (datum, lokacija, klijent)..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </InputGroup>
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
                                    <span className="text-muted">Količina opreme:</span>
                                    <span className="fw-semibold">{event.uredjaji ? event.uredjaji.length : 0}</span>
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
                                <Button
                                    variant="success"
                                    onClick={() => zavrsiEvent(event.sifra)}
                                    title="Završi event"
                                >
                                    <FaCheckCircle />
                                </Button>   

                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>

        {/* Pagination komponenta */}
            {totalPages > 1 && (

                <div className="d-flex justify-content-center">
                    <Pagination>
                        <Pagination.First
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                        />
                        <Pagination.Prev
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        />

                        {[...Array(totalPages)].map((_, index) => {
                            const pageNumber = index + 1;
                            // Prikaži samo stranice blizu trenutne stranice
                            if (
                                pageNumber === 1 ||
                                pageNumber === totalPages ||
                                (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                            ) {
                                return (
                                    <Pagination.Item
                                        key={pageNumber}
                                        active={pageNumber === currentPage}
                                        onClick={() => handlePageChange(pageNumber)}
                                    >
                                        {pageNumber}
                                    </Pagination.Item>
                                );
                            } else if (
                                pageNumber === currentPage - 3 ||
                                pageNumber === currentPage + 3
                            ) {
                                return <Pagination.Ellipsis key={pageNumber} disabled />;
                            }
                            return null;
                        })}

                        <Pagination.Next
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        />
                        <Pagination.Last
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                        />
                    </Pagination>
                </div>

            )}

        </>
        
    );
}