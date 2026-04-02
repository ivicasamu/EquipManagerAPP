import { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import KorisniciService from "../../services/korisnici/KorisnikService";
import { GrDislike, GrLike } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import KorisnikService from "../../services/korisnici/KorisnikService";

export default function KorisniciPregled(){

    const navigate = useNavigate()
    const[korisnici, setKorisnici] = useState([])

    useEffect(()=>{
        ucitajKorisnike()
    },[])

    async function ucitajKorisnike() {
        await KorisniciService.get().then((odgovor)=>{
            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }
            setKorisnici(odgovor.data)
        })
    }

    async function obrisi(sifra) {
        if(!confirm('Sigurno obrisati')){
            return
        }
        await KorisnikService.obrisi(sifra)
        ucitajKorisnike()
    }

    return(
        <>
        <Link to={RouteNames.KORISNICI_NOVI} className="btn btn-success w-100 mb-3 mt-3">
            Dodavanje novog korisnika
        </Link>
        <Table striped bordered hover>
            <thead>
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
        </>
    )
}