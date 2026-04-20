import { useEffect, useState } from "react"
import UredjajService from "../../services/uredjaji/UredjajService"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import KategorijaService from "../../services/kategorije/KategorijaService"
import StatusService from "../../services/statusi/StatusService"
import useBreakpoint from "../../hooks/useBrakepoint"
import UredjajPregledTablica from "./UredjajPregledTablica"
import UredjajPregledGrid from "./UredjajPregledGrid"

export default function UredjajPregled(){

    const navigate = useNavigate()
    const sirina = useBreakpoint();

    const [uredjaji, setUredjaji] = useState([])
    const [kategorije, setKategorije] = useState([])
    const [statusi, setStatusi] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [totalItems, setTotalItems] = useState(0)
    const pageSize = 10

    useEffect(() => {
        ucitajUredjaji(currentPage)
    }, [currentPage])

    useEffect(() => {
        ucitajKategorije()
        ucitajStatuse()
    }, [])

    async function ucitajUredjaji(page) {
        await UredjajService.getPage(page, pageSize).then((odgovor)=>{
            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }
            setUredjaji(odgovor.data)
            setTotalPages(odgovor.totalPages)
            setTotalItems(odgovor.totalItems)
        })
    }

    async function ucitajKategorije() {
        await KategorijaService.get().then((odgovor)=>{
            if(!odgovor.success){
                alert('Nije implementiran servis za smjerove')
                return
            }
            setKategorije(odgovor.data)
        })
    }

    async function ucitajStatuse() {
        await StatusService.get().then((odgovor)=>{
            if(!odgovor.success){
                alert('Nije implementiran servis za smjerove')
                return
            }
            setStatusi(odgovor.data)
        })
    }

    async function brisanje(sifra) {
        if (!confirm('Sigurno obrisati?')) return;
        await UredjajService.obrisi(sifra);

        const newTotalItems = totalItems - 1;
        const newTotalPages = Math.ceil(newTotalItems / pageSize);

        if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
        } else {
            ucitajUredjaji(currentPage);
        }
    }

    function handlePageChange(page) {
        setCurrentPage(page)
    }

    function dohvatiNazivKategorije(sifraKategorija) {
        const kategorija = kategorije.find(s => s.sifra === sifraKategorija)
        return kategorija ? kategorija.naziv : 'Nepoznata kategorija'
    }

    function dohvatiNazivStatusa(sifraStatusa) {
        const status = statusi.find(s => s.sifra === sifraStatusa)
        return status ? status.naziv : 'Nepoznati status'
    }

    return(
        <>
        <Link to={RouteNames.UREDJAJI_NOVI}
        className="btn btn-success w-100 my-3">
            Dodavanje novog uređaja
        </Link>
        {['xs', 'sm', 'md'].includes(sirina) ? (
            <UredjajPregledGrid
                uredjaji={uredjaji} 
                dohvatiNazivKategorije={dohvatiNazivKategorije}
                dohvatiNazivStatusa={dohvatiNazivStatusa}
                navigate={navigate} 
                brisanje={brisanje} 
                totalPages={totalPages}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
            />
        ) : (
            <UredjajPregledTablica
                uredjaji={uredjaji}
                dohvatiNazivKategorije={dohvatiNazivKategorije}
                dohvatiNazivStatusa={dohvatiNazivStatusa} 
                navigate={navigate} 
                brisanje={brisanje} 
                totalPages={totalPages}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
            />
        )}
        </>
    )
}
