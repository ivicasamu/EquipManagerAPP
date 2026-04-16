import { Button, Table } from "react-bootstrap";

export default function UredjajPregledTablica({ uredjaji, dohvatiNazivKategorije, dohvatiNazivStatusa, navigate, brisanje }) {
    
    return (
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
                        <td>
                            <Button onClick={()=>{navigate(`/uredjaji/${uredjaj.sifra}`)}}>
                                Promjeni
                            </Button>
                            &nbsp;&nbsp;
                            <Button variant="danger" onClick={() => brisanje(uredjaj.sifra)}>
                                Obriši
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}