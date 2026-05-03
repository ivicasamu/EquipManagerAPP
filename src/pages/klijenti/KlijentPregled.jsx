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
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [totalItems, setTotalItems] = useState(0)
    const pageSize = 10

    useEffect(()=>{
        ucitajKlijente(currentPage)
    },[currentPage])

    async function ucitajKlijente(page) {
        await KlijentiService.getPage(page, pageSize).then((odgovor)=>{
            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }
            setKlijenti(odgovor.data)
            setTotalPages(odgovor.totalPages)
            setTotalItems(odgovor.totalItems)
        })
    }

    async function obrisi(sifra) {
        if(!confirm('Sigurno obrisati')){
            return
        }
        await KlijentService.obrisi(sifra)
        const newTotalItems = totalItems - 1;
        const newTotalPages = Math.ceil(newTotalItems / pageSize);

        if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
        } else {
            ucitajKlijente(currentPage);
        }
    }

    function handlePageChange(page) {
        setCurrentPage(page)
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
                obrisi={obrisi}
                totalPages={totalPages}
                currentPage={currentPage}
                handlePageChange={handlePageChange} 
            />
        ) : (
            <KlijentPregledTablica
                klijenti={klijenti} 
                navigate={navigate} 
                obrisi={obrisi}
                totalPages={totalPages}
                currentPage={currentPage}
                handlePageChange={handlePageChange}  
            />
        )}
        </>
    )
}