import { useEffect, useState } from "react"
import UredjajService from "../../services/uredjaji/UredjajService"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import KategorijaService from "../../services/kategorije/KategorijaService"
import StatusService from "../../services/statusi/StatusService"
import useBreakpoint from "../../hooks/useBrakepoint"
import UredjajPregledTablica from "./UredjajPregledTablica"
import UredjajPregledGrid from "./UredjajPregledGrid"
import useLoading from "../../hooks/useLoading"

export default function UredjajPregled(){

    const navigate = useNavigate()
    const sirina = useBreakpoint();

    const [uredjaji, setUredjaji] = useState([])

    const [kategorije, setKategorije] = useState([])
    const [statusi, setStatusi] = useState([])

    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [totalItems, setTotalItems] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const { showLoading, hideLoading} = useLoading()

    const [sortConfig, setSortConfig] = useState({
        key: 'sifra',
        direction: 'asc'
    })

    const pageSize = 10

    useEffect(() => {
        ucitajKategorije()
        ucitajStatuse()
    }, [])

    useEffect(() => {
        ucitajSveUredjaje(currentPage, searchTerm, sortConfig)
    }, [currentPage, searchTerm, sortConfig])

    async function ucitajSveUredjaje(page, search, sort) {
        showLoading()

        const odgovor = await UredjajService.getPage(
            page,
            pageSize,
            search,
            sort.key,
            sort.direction
        )

        setUredjaji(odgovor.data)
        setTotalPages(odgovor.totalPages)
        setTotalItems(odgovor.totalItems)

        hideLoading()
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

        showLoading()
        await new Promise(resolve => setTimeout(resolve, 1000))

        await UredjajService.obrisi(sifra);
        const newTotalItems = totalItems - 1;
        const newTotalPages = Math.ceil(newTotalItems / pageSize);

        hideLoading()

        if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
        } else {
            ucitajSveUredjaje(currentPage, searchTerm);
        }
    }

    function handlePageChange(page) {
        setCurrentPage(page)
    }

    function handleSearchChange(e) {
        setSearchTerm(e.target.value)
        setCurrentPage(1) // Reset na prvu stranicu pri pretraživanju
    }

    function handleSort(key) {
        setSortConfig(prev => {
            let direction = 'asc'

            if (prev.key === key && prev.direction === 'asc') {
                direction = 'desc'
            }

            return { key, direction }
        })

        setCurrentPage(1)
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