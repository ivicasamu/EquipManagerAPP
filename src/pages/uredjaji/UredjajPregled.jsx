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

    useEffect(()=>{
        ucitajUredjaji()
        ucitajKategorije()
        ucitajStatuse()
    },[])

    async function ucitajUredjaji() {
        await UredjajService.get().then((odgovor)=>{
            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }
            setUredjaji(odgovor.data)
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
        await UredjajService.get().then((odgovor)=>{
            setUredjaji(odgovor.data)
        })
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
            />
        ) : (
            <UredjajPregledTablica
                uredjaji={uredjaji}
                dohvatiNazivKategorije={dohvatiNazivKategorije}
                dohvatiNazivStatusa={dohvatiNazivStatusa} 
                navigate={navigate} 
                brisanje={brisanje} 
            />
        )}
        </>
    )
}
