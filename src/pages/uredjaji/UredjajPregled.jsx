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
    const [sviUredjaji, setSviUredjaji] = useState([])

    const [kategorije, setKategorije] = useState([])
    const [statusi, setStatusi] = useState([])

    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [totalItems, setTotalItems] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')

    const [sortConfig, setSortConfig] = useState(() => {
        const saved = localStorage.getItem("uredjaji_sort");
        return saved ? JSON.parse(saved) : { key: null, direction: null };
    });

    const pageSize = 10

    useEffect(() => {
        ucitajSveUredjaje(1, '')
        ucitajKategorije()
        ucitajStatuse()
    }, [])

    useEffect(() => {
        ucitajSveUredjaje(currentPage, searchTerm)
    }, [currentPage, searchTerm])

    async function ucitajSveUredjaje(page, search) {
    const odgovor = await UredjajService.getPage(
        page,
        pageSize,
        search
    )

    if (!odgovor.success) {
        alert('Greška')
        return
    }

    setUredjaji(odgovor.data) // ✔ array
    setTotalPages(odgovor.totalPages)
    setTotalItems(odgovor.totalItems)
}

    async function ucitajKategorije() {
        const odgovor = await KategorijaService.get()
        setKategorije(odgovor.data)
    }

    async function ucitajStatuse() {
        const odgovor = await StatusService.get()
        setStatusi(odgovor.data)
    }

    async function brisanje(sifra) {
        if (!confirm('Sigurno obrisati?')) return;

        await UredjajService.obrisi(sifra)

        const novi = sviUredjaji.filter(u => u.sifra !== sifra)
        setSviUredjaji(novi)
    }

    function handlePageChange(page) {
        setCurrentPage(page)
    }

    function handleSearchChange(e) {
        setSearchTerm(e.target.value)
        setCurrentPage(1) // Reset na prvu stranicu pri pretraživanju
    }

    function handleSort(key) {
        let direction = 'asc'

        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = null
        }

        setSortConfig({ key, direction })
        setCurrentPage(1) // UX fix
    }

    function dohvatiNazivKategorije(sifra) {
        const k = kategorije.find(s => s.sifra === sifra)
        return k ? k.naziv : ''
    }

    function dohvatiNazivStatusa(sifra) {
        const s = statusi.find(s => s.sifra === sifra)
        return s ? s.naziv : ''
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
                handleSearchChange = {handleSearchChange}
                searchTerm = {searchTerm}
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
                handleSort={handleSort}
                sortConfig={sortConfig}
                handleSearchChange = {handleSearchChange}
                searchTerm = {searchTerm}
            />
        )}
        </>
    )
}