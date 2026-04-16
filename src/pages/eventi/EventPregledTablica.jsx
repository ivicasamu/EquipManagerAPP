import { Button, Table } from "react-bootstrap";
import FormatDatuma from "../../components/FormatDatuma";

export default function EventPregledTablica({  eventi, dohvatiNazivKlijenta, navigate, brisanje }) {
    
    return (
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
                        <td>
                            <Button onClick={()=>{navigate(`/eventi/${event.sifra}`)}}>
                                Promjeni
                            </Button>
                            &nbsp;&nbsp;
                            <Button variant="danger" onClick={() => brisanje(event.sifra)}>
                                Obriši
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}