import { Button, Table } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { GrDislike, GrLike } from "react-icons/gr";

export default function KorisnikPregledTablica({ 
    korisnici, 
    navigate, 
    obrisi }) {
    
    return (
        <div className="table-responsive">
            <Table striped bordered hover className="align-middle"> 
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
                            <td className="text-center align-middle">
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
                            <td className="text-center align-middle">
                                <div className="d-flex justify-content-center gap-2 flex-nowrap">
                                    <Button 
                                        onClick={()=>{navigate(`/korisnici/${korisnik.sifra}`)}}
                                    >
                                        <FaEdit />
                                    </Button>
                                    &nbsp;&nbsp;
                                    <Button 
                                        variant="danger" 
                                        onClick={()=>{obrisi(korisnik.sifra)}}
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
    );
}