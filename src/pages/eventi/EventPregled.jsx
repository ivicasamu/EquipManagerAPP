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
import useLoading from "../../hooks/useLoading"

export default function EventPregled(){

    const navigate = useNavigate()
    const sirina = useBreakpoint();

    const [eventi, setEventi] = useState([])
    const [klijenti, setKlijenti] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [totalItems, setTotalItems] = useState(0)
    const [sviUredjaji, setSviUredjaji] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const pageSize = 10
    const { showLoading, hideLoading} = useLoading()

    const [tooltip, setTooltip] = useState({
        vidljivo: false,
        x: 0,
        y: 0,
        podaci: []
    })

    useEffect(()=>{
        ucitajUredjaje()
        ucitajKlijente()
        ucitajEventi(currentPage, searchTerm)
    },[currentPage,searchTerm])

    async function ucitajEventi(page, search) {
        showLoading()
        await new Promise(resolve => setTimeout(resolve, 1000))
        await EventService.getPage(page, pageSize, search).then((odgovor)=>{
            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }
            setEventi(odgovor.data)
            setTotalPages(odgovor.totalPages)
            setTotalItems(odgovor.totalItems)
            hideLoading()
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

        showLoading()
        await new Promise(resolve => setTimeout(resolve, 1000))

        await EventService.obrisi(sifra);
        const newTotalItems = totalItems - 1;
        const newTotalPages = Math.ceil(newTotalItems / pageSize);

        hideLoading()

        if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
        } else {
            ucitajEventi(currentPage, searchTerm);
        }
    }

    async function ucitajUredjaje(){
        await UredjajService.get().then((odgovor) => {
            if (!odgovor.success) {
                alert('Nije implementiran servis')
                return
            }
            setSviUredjaji(odgovor.data)
        })
    }

    // --- LOGIKA ZA TOOLTIP ---
    const handleMouseEnter = (sifreUredjajaUGrupi) => {
        if (!sifreUredjajaUGrupi || sifreUredjajaUGrupi.length === 0) return;

        // Filtriraj objekte polaznika na temelju šifri iz grupe
        const filtrirani = sviUredjaji.filter(p => sifreUredjajaUGrupi.includes(p.sifra));

        setTooltip(prev => ({ ...prev, vidljivo: true, podaci: filtrirani }));
    };

    const handleMouseMove = (e) => {
        // Pomicanje tooltipa 15px desno i dolje od miša da ne smeta kursoru
        setTooltip(prev => ({ ...prev, x: e.pageX + 15, y: e.pageY + 15 }));
    };

    const handleMouseLeave = () => {
        setTooltip(prev => ({ ...prev, vidljivo: false, podaci: [] }));
    }

    function handlePageChange(page) {
        setCurrentPage(page)
    }

    function handleSearchChange(e) {
        setSearchTerm(e.target.value)
        setCurrentPage(1) // Reset na prvu stranicu pri pretraživanju
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
            handleSearchChange={handleSearchChange}
            searchTerm={searchTerm}
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
            handleMouseEnter = {handleMouseEnter}
            handleMouseMove = {handleMouseMove} 
            handleMouseLeave = {handleMouseLeave} 
            tooltip = {tooltip}
            handleSearchChange={handleSearchChange}
            searchTerm={searchTerm} 
        />
    )}
        </>
    )
}
