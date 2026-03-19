import { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import KorisniciService from "../../services/korisnici/KorisniciService";
import { GrDislike, GrLike } from "react-icons/gr";

export default function KorisniciPregled(){

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
                    <tr>
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
                        <td></td>
                    </tr>
                ))}
            </tbody>
        </Table>
        </>
    )
}