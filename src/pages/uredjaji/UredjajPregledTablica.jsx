import { Button, Pagination, Table } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function UredjajPregledTablica({ uredjaji, dohvatiNazivKategorije, dohvatiNazivStatusa, navigate, brisanje, totalPages, currentPage, handlePageChange }) {
    
    return (
        <>
        <Table striped bordered hover>
            <thead className="text-center">
                <tr>
                    <th>Kategorija</th>
                    <th>Model</th>
                    <th>Serijski broj</th>
                    <th>Status</th>
                    <th>Napomena</th>
                    <th>Akcija</th>
                </tr>
            </thead>
            <tbody>
                {uredjaji && uredjaji.map((uredjaj)=>(
                    <tr key={uredjaj.sifra}>
                        <td className="lead">{dohvatiNazivKategorije(uredjaj.kategorija)}</td>
                        <td>{uredjaj.model}</td>
                        <td>{uredjaj.serijskiBroj}</td>
                        <td>{dohvatiNazivStatusa(uredjaj.status)}</td>
                        <td>{uredjaj.napomena}</td>
                        <td className="text-center">
                            <Button onClick={()=>{navigate(`/uredjaji/${uredjaj.sifra}`)}}>
                                <FaEdit />
                            </Button>
                            &nbsp;&nbsp;
                            <Button variant="danger" onClick={() => brisanje(uredjaj.sifra)}>
                                <FaTrash />
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>

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