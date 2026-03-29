import { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import KorisniciService from "../../services/korisnici/KorisnikService";
import { GrDislike, GrLike } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";

export default function KorisniciPregled(){

    const navigate = useNavigate()
    const[korisnici, setKorisnici] = useState([])

    useEffect(()=>{
        ucitajKorisnike()
    },[])

    async function ucitajKorisnike() {
        await KorisniciService.get().then((odgovor)=>{
            setKorisnici(odgovor.data)
        })
    }

    return(
        <>
        <Link to={RouteNames.KORISNICI_NOVI} className="btn btn-success w-100 mb-3 mt-3">
            Dodavanje novog korisnika
        </Link>
        <Table>
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
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        </>
    )
}