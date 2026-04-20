import { useEffect, useState } from "react"
import EventService from "../../services/eventi/EventService"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import KlijentService from "../../services/klijenti/KlijentService"
import UredjajService from "../../services/uredjaji/UredjajService"
import EventPregledGrid from "./EventPregledGrid"
import EventPregledTablica from "./EventPregledTablica"
import useBreakpoint from "../../hooks/useBrakepoint"
import EventPDFGenerator from "../../components/EventPDFGenerator"

export default function EventPregled(){

    const navigate = useNavigate()
    const sirina = useBreakpoint();

    const [eventi, setEventi] = useState([])
    const [klijenti, setKlijenti] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [totalItems, setTotalItems] = useState(0)
    const pageSize = 10

    useEffect(()=>{
        ucitajEventi(currentPage)
        ucitajKlijente()
    },[currentPage])

    async function ucitajEventi(page) {
        await EventService.getPage(page, pageSize).then((odgovor)=>{
            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }
            setEventi(odgovor.data)
            setTotalPages(odgovor.totalPages)
            setTotalItems(odgovor.totalItems)
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
        const newTotalItems = totalItems - 1;
        const newTotalPages = Math.ceil(newTotalItems / pageSize);

        if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
        } else {
            ucitajEventi(currentPage);
        }
    }

    function handlePageChange(page) {
        setCurrentPage(page)
    }

    function dohvatiNazivKlijenta(sifraKlijent) {
        const klijent = klijenti.find(s => s.sifra === sifraKlijent)
        return klijent ? klijent.naziv : 'Nepoznati klijent'
    }

    async function generirajPDFZaEvent(event) {
        // Dohvati klijenta
        const klijent = klijenti.find(s => s.sifra === event.klijent)
        if (!klijent) {
            alert('Klijent nije pronađen')
            return
        }

        // Dohvati sve uređaje
        const odgovorUredjaji = await UredjajService.get()
        if (!odgovorUredjaji.success) {
            alert('Nije moguće dohvatiti uređaje')
            return
        }

        // Filtriraj uređaje koji pripadaju ovom eventu
        const uredjajiNaEventu = odgovorUredjaji.data.filter(p =>
            event.uredjaji && event.uredjaji.includes(p.sifra)
        )

        // Generiraj PDF
        const generiraj = EventPDFGenerator({
            event,
            klijent,
            uredjaji: uredjajiNaEventu
        })
        await generiraj()
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
            generirajPDFZaEvent={generirajPDFZaEvent}
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange} 
        />
        ) : (
        <EventPregledTablica
            eventi={eventi} 
            dohvatiNazivKlijenta={dohvatiNazivKlijenta}
            navigate={navigate} 
            brisanje={brisanje}
            generirajPDFZaEvent={generirajPDFZaEvent}
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}  
        />
    )}
        </>
    )
}
