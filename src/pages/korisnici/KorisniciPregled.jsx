import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import KorisniciService from "../../services/korisnici/KorisniciService";

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
        <ul>
            {korisnici && korisnici.map((korisnik)=>(
                <li>{korisnik.korisnickoIme}</li>
            ))}
        </ul>
        </>
    )
}