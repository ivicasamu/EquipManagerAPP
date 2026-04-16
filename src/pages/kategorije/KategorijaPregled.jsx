import { useEffect, useState } from "react"
import { Button, Container, Table } from "react-bootstrap"
import { GrDislike, GrLike } from "react-icons/gr"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import KategorijaService from "../../services/kategorije/KategorijaService"

export default function KategorijaPregled(){

    const navigate = useNavigate()
    const[kategorije, setKategorije] = useState([])

    useEffect(()=>{
        ucitajKategorije()
    },[])

    async function ucitajKategorije() {
        await KategorijaService.get().then((odgovor)=>{
            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }
            // console.log(odgovor.data)
            setKategorije(odgovor.data)
        })
    }

    async function obrisi(sifra) {
        if(!confirm('Sigurno obrisati')){
            return
        }
        await KategorijaService.obrisi(sifra)
        ucitajKategorije()
    }

    return(
        <>
        <Link to={RouteNames.KATEGORIJE_NOVI} className="btn btn-success w-100 mb-3 mt-3">
            Dodavanje nove kategorije
        </Link>
        <Table striped bordered hover>
            <thead className="text-center">
                <tr>
                    <th>Naziv</th>
                    <th>Aktivna</th>
                    <th>Akcija</th>
                </tr>
            </thead>
            <tbody>
                {kategorije && kategorije.map((kategorija)=>(
                    <tr key={kategorija.sifra}>
                        <td>{kategorija.naziv}</td>
                        <td>
                            {(kategorija.aktivna) &&
                            <GrLike 
                                size={20}
                                color='green'
                            />
                            }
                            {(!kategorija.aktivna) &&
                            <GrDislike 
                                size={20}
                                color='red'
                            />
                            }
                            
                        </td>
                        <td>
                            <Button onClick={()=>{navigate(`/kategorije/${kategorija.sifra}`)}}>
                                Promjena
                            </Button>
                            &nbsp;&nbsp;
                            <Button variant="danger" onClick={()=>{obrisi(kategorija.sifra)}}>
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