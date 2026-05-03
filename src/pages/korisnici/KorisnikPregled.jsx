import { useEffect, useState } from "react";
import KorisniciService from "../../services/korisnici/KorisnikService";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import KorisnikService from "../../services/korisnici/KorisnikService";
import KorisnikPregledGrid from "./KorisnikPregledGrid";
import KorisnikPregledTablica from "./KorisnikPregledTable";
import useBreakpoint from "../../hooks/useBrakepoint";

export default function KorisniciPregled(){

    const navigate = useNavigate()
    const sirina = useBreakpoint();
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
        {['xs', 'sm', 'md'].includes(sirina) ? (
            <KorisnikPregledGrid
                korisnici={korisnici} 
                navigate={navigate} 
                obrisi={obrisi} 
            />
        ) : (
            <KorisnikPregledTablica
                korisnici={korisnici} 
                navigate={navigate} 
                obrisi={obrisi}  
            />
        )}
        </>
    )
}