import { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import KlijentiService from "../../services/klijenti/KlijentService";
import { GrDislike, GrLike } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import KlijentService from "../../services/klijenti/KlijentService";

export default function KlijentiPregled(){

    const navigate = useNavigate()
    const[klijenti, setKlijenti] = useState([])

    useEffect(()=>{
        ucitajKlijente()
    },[])

    async function ucitajKlijente() {
        await KlijentiService.get().then((odgovor)=>{
            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }
            setKlijenti(odgovor.data)
        })
    }

    async function obrisi(sifra) {
        if(!confirm('Sigurno obrisati')){
            return
        }
        await KlijentService.obrisi(sifra)
        ucitajKlijente()
    }

    return(
        <>
        <Link to={RouteNames.KLIJENTI_NOVI} className="btn btn-success w-100 mb-3 mt-3">
            Dodavanje novog klijenta
        </Link>
        <Table striped bordered hover>
            <thead className="text-center">
                <tr>
                    <th>Naziv</th>
                    <th>Adresa</th>
                    <th>OIB</th>
                    <th>Kontakt osoba</th>
                    <th>Kontakt</th>
                    <th>Akcija</th>
                </tr>
            </thead>
            <tbody>
                {klijenti && klijenti.map((klijent)=>(
                    <tr key={klijent.sifra}>
                        <td>{klijent.naziv}</td>
                        <td>{klijent.adresa}</td>
                        <td>{klijent.oib}</td>
                        <td>{klijent.kontaktOsoba}</td>
                        <td>{klijent.tel},<br /> {klijent.email}</td>
                        <td>
                            <Button onClick={()=>{navigate(`/klijenti/${klijent.sifra}`)}}>
                                Promjena
                            </Button>
                            &nbsp;&nbsp;
                            <Button variant="danger" onClick={()=>{obrisi(klijent.sifra)}}>
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