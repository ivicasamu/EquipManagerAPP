import { Button, Card, Row, Col, Container, Pagination } from "react-bootstrap"
import { FaEdit, FaTrash } from "react-icons/fa"

export default function UredjajPregledGrid({ uredjaji, dohvatiNazivKategorije, dohvatiNazivStatusa, navigate, brisanje, totalPages, currentPage, handlePageChange }) {

    function skratiTekst(tekst, max = 100) {
        if (!tekst) return '-'
        return tekst.length > max
            ? tekst.substring(0, max) + '...'
            : tekst
    }

    return (
        <>
            <Container className="py-3 px-0">
                <Row>
                    {uredjaji && uredjaji.map((uredjaj) => (

                        <Col key={uredjaj.sifra} xs={12} md={6} className="mb-4">
                            <Card className="shadow-sm h-100">
                                <Card.Header className="d-flex justify-content-between align-items-center bg-white py-3">
                                    <span className="fw-bold text-primary" style={{ fontSize: '1.1rem' }}>
                                        {uredjaj.model} (sn: {uredjaj.serijskiBroj})
                                    </span>
                                </Card.Header>

                                <Card.Body>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Kategorija</span>
                                        <span className="fw-semibold">{dohvatiNazivKategorije(uredjaj.kategorija)}</span>
                                    </div>

                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Status:</span>
                                        <span className="fw-semibold">{dohvatiNazivStatusa(uredjaj.status)}</span>
                                    </div>

                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Napomena:</span>
                                        <span className="fw-semibold">{skratiTekst(uredjaj.napomena, 50)}</span>
                                    </div>
                                </Card.Body>

                                <Card.Footer className="bg-light d-flex gap-2">
                                    <Button
                                        variant="outline-primary"
                                        className="flex-fill"
                                        onClick={() => navigate(`/uredjaji/${uredjaj.sifra}`)}
                                        title="Promjeni"
                                    >
                                        <FaEdit />
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        className="flex-fill"
                                        onClick={() => brisanje(uredjaj.sifra)}
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