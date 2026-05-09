import { Button, Pagination, Table } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function KlijentPregledTablica({ 
    klijenti, 
    navigate, 
    obrisi, 
    totalPages, 
    currentPage, 
    handlePageChange }) {
    
    return (
        <>
        <div className="table-responsive">
            <Table striped bordered hover className="align-middle"> 
                <thead className="text-center">
                    <tr>
                        <th>Naziv</th>
                        <th>Adresa</th>
                        <th>OIB</th>
                        <th>Kontakt osoba</th>
                        <th>Kontakt</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {klijenti && klijenti.map((klijent)=>(
                        <tr key={klijent.sifra}>
                            <td>{klijent.naziv}</td>
                            <td>{klijent.adresa}</td>
                            <td>{klijent.oib}</td>
                            <td>{klijent.kontaktOsoba}</td>
                            <td>{klijent.tel}<br /> {klijent.email}</td>
                            <td className="text-center align-middle">
                                <div className="d-flex justify-content-center gap-2 flex-nowrap">
                                    <Button 
                                        
                                        onClick={()=>{navigate(`/klijenti/${klijent.sifra}`)}}
                                    >
                                        <FaEdit />
                                    </Button>
                                    &nbsp;&nbsp;
                                    <Button 
                                        
                                        variant="danger" 
                                        onClick={()=>{obrisi(klijent.sifra)}}
                                    >
                                        <FaTrash />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>

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