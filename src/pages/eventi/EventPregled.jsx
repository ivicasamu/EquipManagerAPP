import { useEffect, useState } from "react"
import EventService from "../../services/eventi/EventService"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import KlijentService from "../../services/klijenti/KlijentService"
import EventPregledGrid from "./EventPregledGrid"
import EventPregledTablica from "./EventPregledTablica"
import useBreakpoint from "../../hooks/useBrakepoint";

export default function EventPregled(){

    const navigate = useNavigate()
    const sirina = useBreakpoint();

    const [eventi, setEventi] = useState([])
    const [klijenti, setKlijenti] = useState([])

    useEffect(()=>{
        ucitajEventi()
        ucitajKlijente()
    },[])

    async function ucitajEventi() {
        await EventService.get().then((odgovor)=>{
            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }
            setEventi(odgovor.data)
        })
    }

    async function ucitajKlijente() {
        await KlijentService.get().then((odgovor)=>{
            if(!odgovor.success){
                alert('Nije implementiran servis za klijente')
                return
            }
            setKlijenti(odgovor.data)
        })
    }

    async function brisanje(sifra) {
        if (!confirm('Sigurno obrisati?')) return;
        await EventService.obrisi(sifra);
        await EventService.get().then((odgovor)=>{
            setEventi(odgovor.data)
        })
    }

    function dohvatiNazivKlijenta(sifraKlijent) {
        const klijent = klijenti.find(s => s.sifra === sifraKlijent)
        return klijent ? klijent.naziv : 'Nepoznati klijent'
    }

    return(
        <>
        <Link to={RouteNames.EVENTI_NOVI}
        className="btn btn-success w-100 my-3">
            Dodavanje novog eventa
        </Link>
        {['xs', 'sm', 'md'].includes(sirina) ? (
        <EventPregledGrid
            eventi={eventi} 
            dohvatiNazivKlijenta={dohvatiNazivKlijenta}
            navigate={navigate} 
            brisanje={brisanje} 
        />
        ) : (
        <EventPregledTablica
            eventi={eventi} 
            dohvatiNazivKlijenta={dohvatiNazivKlijenta}
            navigate={navigate} 
            brisanje={brisanje} 
        />
    )}
        </>
    )
}
