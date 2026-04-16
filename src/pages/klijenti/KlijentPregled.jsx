import { useEffect, useState } from "react";
import KlijentiService from "../../services/klijenti/KlijentService";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import KlijentService from "../../services/klijenti/KlijentService";
import KlijentPregledTablica from "./KlijentPregledTable";
import KlijentPregledGrid from "./KlijentPregledGrid";
import useBreakpoint from "../../hooks/useBrakepoint";

export default function KlijentiPregled(){

    const navigate = useNavigate()
    const sirina = useBreakpoint()
    const[klijenti, setKlijenti] = useState([])

    useEffect(()=>{
        ucitajKlijente()
    },[])

    async function ucitajKlijente() {
        await KlijentiService.get().then((odgovor)=>{
            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }
            setKlijenti(odgovor.data)
        })
    }

    async function brisanje(sifra) {
        if(!confirm('Sigurno obrisati')){
            return
        }
        await KlijentService.obrisi(sifra)
        ucitajKlijente()
    }

    return(
        <>
        <Link to={RouteNames.KLIJENTI_NOVI} className="btn btn-success w-100 mb-3 mt-3">
            Dodavanje novog klijenta
        </Link>
        {['xs', 'sm', 'md'].includes(sirina) ? (
            <KlijentPregledGrid
                klijenti={klijenti} 
                navigate={navigate} 
                brisanje={brisanje} 
            />
        ) : (
            <KlijentPregledTablica
                klijenti={klijenti} 
                navigate={navigate} 
                brisanje={brisanje}  
            />
        )}
        </>
    )
}