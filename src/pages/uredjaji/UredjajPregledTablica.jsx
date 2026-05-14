import { Button, Form, InputGroup, Pagination, Table } from "react-bootstrap";
import { FaEdit, FaPrint, FaSearch, FaSort, FaSortDown, FaSortUp, FaTrash } from "react-icons/fa";

export default function UredjajPregledTablica({ 
    uredjaji, 
    dohvatiNazivKategorije, 
    dohvatiNazivStatusa, 
    navigate, 
    brisanje, 
    totalPages, 
    currentPage, 
    handlePageChange,
    handleSort,
    sortConfig,
    handleSearchChange,
    searchTerm, 
    generirajPDFZaUredjaj
}) {

    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey || sortConfig.direction === null) {
            return <FaSort />;
        }
        return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
    };

    return (
        <>
        <InputGroup className="mb-3">
            <InputGroup.Text>
                <FaSearch />
            </InputGroup.Text>
            <Form.Control
                type="text"
                placeholder="Pretraži uređaje (model, serijski broj, status, kategorija)..."
                value={searchTerm}
                onChange={handleSearchChange}
            />
        </InputGroup>
        <div className="table-responsive">
            <Table striped bordered hover className="align-middle">
                <thead className="text-center">
                    <tr>
                        <th onClick={() => handleSort('kategorija')} style={{ cursor: 'pointer' }}>
                            Kategorija {getSortIcon('kategorija')}
                        </th>
                        <th onClick={() => handleSort('model')} style={{ cursor: 'pointer' }}>
                            Model {getSortIcon('model')}
                        </th>
                        <th>Serijski broj</th>
                        <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                            Status {getSortIcon('status')}
                        </th>
                        <th>Napomena</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {uredjaji && uredjaji.map((uredjaj)=>(
                        <tr 
                            key={uredjaj.sifra}
                            onClick={()=>{navigate(`/uredjaji/${uredjaj.sifra}`)}}
                            style={{cursor: 'pointe'}}
                        >
                            <td>{dohvatiNazivKategorije(uredjaj.kategorija)}</td>
                            <td>{uredjaj.model}</td>
                            <td>{uredjaj.serijskiBroj}</td>
                            <td>{dohvatiNazivStatusa(uredjaj.status)}</td>
                            <td style={{
                                maxWidth: '200px',
                                whiteSpace: 'wrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {uredjaj.napomena}
                            </td>
                            <td className="text-center align-middle">
                                <div className="d-flex justify-content-center gap-2 flex-nowrap">
                                    <Button onClick={(e) => {
                                        e.stopPropagation()
                                        {navigate(`/uredjaji/${uredjaj.sifra}`)}
                                    }}>
                                        <FaEdit />
                                    </Button>
                                    &nbsp;&nbsp;
                                    <Button variant="danger" 
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            brisanje(uredjaj.sifra)
                                    }}>
                                        <FaTrash />
                                    </Button>
                                    &nbsp;&nbsp;
                                    <Button 
                                        variant="info" 
                                        onClick={() => generirajPDFZaUredjaj(uredjaj)} 
                                        title="Generiraj PDF">
                                        <FaPrint />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>

        {totalPages > 1 && (
            <div className="d-flex justify-content-center">
                <Pagination>
                    <Pagination.First
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        aria-label="Prva stranica"
                    />
                    <Pagination.Prev
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label="Prethodna stranica"
                    />

                    {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;

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
                        aria-label="Sljedeća stranica"
                    />
                    <Pagination.Last
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        aria-label="Zadnja stranica"
                    />
                </Pagination>
            </div>
        )}
        </>
    );
}