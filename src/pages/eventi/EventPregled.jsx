import { useEffect, useState } from "react"
import EventService from "../../services/eventi/EventService"
import { Button, Table } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import KlijentService from "../../services/klijenti/KlijentService"
import FormatDatuma from "../../components/FormatDatuma"

export default function EventPregled(){

    const navigate = useNavigate()

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
        <Table striped bordered hover>
            <thead className="text-center">
                <tr>
                    <th>Datum početka</th>
                    <th>Predviđeno trajanje</th>
                    <th>Lokacija</th>
                    <th>Klijent</th>
                    <th>Napomena</th>
                    <th>Akcija</th>
                </tr>
            </thead>
            <tbody>
                {eventi && eventi.map((event)=>(
                    <tr key={event.sifra}>
                        <td className="lead text-center"><FormatDatuma datum={event.datumPocetka} /></td>
                        <td className="text-center">{event.predvidenoTrajanje}</td>
                        <td>{event.lokacija}</td>
                        <td>{dohvatiNazivKlijenta(event.klijent)}</td>
                        <td>{event.napomena}</td>
                        <td>
                            <Button onClick={()=>{navigate(`/eventi/${event.sifra}`)}}>
                                Promjeni
                            </Button>
                            &nbsp;&nbsp;
                            <Button variant="danger" onClick={() => brisanje(event.sifra)}>
                                Obriši
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        </>
    )
}
