import { Button, Table } from "react-bootstrap";

export default function KorisnikPregledTablica({ korisnici, navigate, brisanje }) {
    
    return (
        <Table striped bordered hover>
            <thead className="text-center">
                <tr>
                    <th>Ime i prezime</th>
                    <th>Korisničko ime</th>
                    <th>Email</th>
                    <th>Administrator</th>
                    <th>Akcija</th>
                </tr>
            </thead>
            <tbody>
                {korisnici && korisnici.map((korisnik)=>(
                    <tr key={korisnik.sifra}>
                        <td>{korisnik.ime} {korisnik.prezime}</td>
                        <td>{korisnik.korisnickoIme}</td>
                        <td>{korisnik.email}</td>
                        <td>
                            {(korisnik.administrator) &&
                            <GrLike 
                                size={20}
                                color='green'
                            />
                            }
                            {(!korisnik.administrator) &&
                            <GrDislike 
                                size={20}
                                color='red'
                            />
                            }
                            
                        </td>
                        <td>
                            <Button onClick={()=>{navigate(`/korisnici/${korisnik.sifra}`)}}>
                                Promjena
                            </Button>
                            &nbsp;&nbsp;
                            <Button variant="danger" onClick={()=>{obrisi(korisnik.sifra)}}>
                                Obriši
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}