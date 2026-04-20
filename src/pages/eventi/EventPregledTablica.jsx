import { Button, Pagination, Table } from "react-bootstrap";
import FormatDatuma from "../../components/FormatDatuma";
import { FaEdit, FaPrint, FaTrash } from "react-icons/fa";

export default function EventPregledTablica({  eventi, dohvatiNazivKlijenta, navigate, brisanje, generirajPDFZaEvent, totalPages, currentPage, handlePageChange }) {
    return (
        <>
        <Table striped bordered hover>
                <thead className="text-center">
                    <tr>
                        <th>Datum početka</th>
                        <th>Predviđeno trajanje</th>
                        <th>Lokacija</th>
                        <th>Klijent</th>
                        <th>Napomena</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {eventi && eventi.map((event)=>(
                        <tr key={event.sifra}>
                            <td className="lead text-center"><FormatDatuma datum={event.datumPocetka} /></td>
                            <td className="text-center">{event.predvidenoTrajanje}</td>
                            <td>{event.lokacija}</td>
                            <td>{dohvatiNazivKlijenta(event.klijent)}</td>
                            <td>{event.napomena}</td>
                            <td className="text-center">
                                <Button onClick={()=>{navigate(`/eventi/${event.sifra}`)}}>
                                    <FaEdit />
                                </Button>
                                &nbsp;&nbsp;
                                <Button variant="danger" onClick={() => brisanje(event.sifra)}>
                                    <FaTrash />
                                </Button>
                                &nbsp;&nbsp;
                                <Button variant="info" onClick={() => generirajPDFZaEvent(event)} title="Generiraj PDF">
                                   <FaPrint />
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