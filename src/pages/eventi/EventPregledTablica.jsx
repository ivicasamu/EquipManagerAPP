import { Button, Form, InputGroup, Pagination, Table } from "react-bootstrap";
import FormatDatuma from "../../components/FormatDatuma";
import { FaEdit, FaPrint, FaSearch, FaTrash } from "react-icons/fa";


export default function EventPregledTablica({  
    eventi, 
    dohvatiNazivKlijenta, 
    navigate, brisanje, 
    generirajPDFZaEvent, 
    totalPages, 
    currentPage, 
    handlePageChange,
    handleMouseEnter,
    handleMouseMove, 
    handleMouseLeave,
    tooltip,
    handleSearchChange,
    searchTerm 
}) {
    return (
        <>
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
        <Table striped bordered hover>
                <thead className="text-center">
                    <tr>
                        <th>Datum početka</th>
                        <th>Predviđeno trajanje</th>
                        <th>Lokacija</th>
                        <th>Oprema</th>
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
                            <td
                                className="text-center"
                                style={{ cursor: 'help', fontWeight: 'bold' }}
                                onMouseEnter={() => handleMouseEnter(event.uredjaji)}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                            >{event.uredjaji ? event.uredjaji.length : 0}</td>
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

            {/* Prikaz popisa polaznika (Tooltip) */}
            {tooltip.vidljivo && (
                <div style={{
                    position: 'absolute',
                    top: tooltip.y,
                    left: tooltip.x,
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    padding: '10px',
                    borderRadius: '5px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    zIndex: 1000,
                    minWidth: '200px',
                    pointerEvents: 'none' // Da tooltip ne "treperi" kad miš uđe u njega
                }}>
                    <h6>Oprema na eventu:</h6>
                    <ol style={{ margin: 0, paddingLeft: '20px' }}>
                        {tooltip.podaci.map(p => (
                            <li key={p.sifra}>{p.model} - sn: {p.serijskiBroj}</li>
                        ))}
                    </ol>
                </div>
            )}

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