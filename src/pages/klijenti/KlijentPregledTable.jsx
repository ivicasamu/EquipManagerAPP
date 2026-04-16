import { Button, Table } from "react-bootstrap";

export default function KlijentPregledTablica({ klijenti, navigate, brisanje }) {
    
    return (
        <Table striped bordered hover>
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
                        <td>{klijent.tel},<br /> {klijent.email}</td>
                        <td>
                            <Button onClick={()=>{navigate(`/klijenti/${klijent.sifra}`)}}>
                                Promjena
                            </Button>
                            &nbsp;&nbsp;
                            <Button variant="danger" onClick={()=>{obrisi(klijent.sifra)}}>
                                Obriši
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}