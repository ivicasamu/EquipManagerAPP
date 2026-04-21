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

    cconst [sortConfig, setSortConfig] = useState(() => {
        const saved = localStorage.getItem("uredjaji_sort");
        return saved ? JSON.parse(saved) : { key: null, direction: null };
    });

    const pageSize = 10

    useEffect(() => {
        ucitajSveUredjaje()
        ucitajKategorije()
        ucitajStatuse()
    }, [])

    useEffect(() => {
        obradiPodatke()
    }, [sviUredjaji, currentPage, sortConfig])

    async function ucitajSveUredjaje() {
        const odgovor = await UredjajService.get()

        if(!odgovor.success){
            alert('Nije implementiran servis')
            return
        }

        setSviUredjaji(odgovor.data)
    }

    function obradiPodatke() {
        let data = [...sviUredjaji]

        // SORT
        if (sortConfig.direction) {
            data.sort((a, b) => {
                let aValue = a[sortConfig.key]
                let bValue = b[sortConfig.key]

                if (sortConfig.key === 'kategorija') {
                    aValue = dohvatiNazivKategorije(a.kategorija)
                    bValue = dohvatiNazivKategorije(b.kategorija)
                }

                if (sortConfig.key === 'status') {
                    aValue = dohvatiNazivStatusa(a.status)
                    bValue = dohvatiNazivStatusa(b.status)
                }

                if (typeof aValue === 'string') {
                    const result = aValue.localeCompare(bValue, 'hr', { sensitivity: 'accent' })
                    return sortConfig.direction === 'asc' ? result : -result
                }

                return sortConfig.direction === 'asc'
                    ? aValue - bValue
                    : bValue - aValue
            })
        }

        // PAGINATION
        const totalItems = data.length
        const totalPages = Math.ceil(totalItems / pageSize)

        const start = (currentPage - 1) * pageSize
        const paginated = data.slice(start, start + pageSize)

        setUredjaji(paginated)
        setTotalItems(totalItems)
        setTotalPages(totalPages)
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
                handleSort={handleSort}
                sortConfig={sortConfig}
            />
        )}
        </>
    )
}