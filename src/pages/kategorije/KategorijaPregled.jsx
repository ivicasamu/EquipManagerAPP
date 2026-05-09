import { useEffect, useState } from "react"
import { Button, Container, Table } from "react-bootstrap"
import { GrDislike, GrLike } from "react-icons/gr"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import KategorijaService from "../../services/kategorije/KategorijaService"
import { FaEdit, FaTrash } from "react-icons/fa"

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
        <div className="table-responsive">
            <Table striped bordered hover className="align-middle"> 
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
                            <td className="text-center align-middle">
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
                           <td className="text-center align-middle">
                                <div className="d-flex justify-content-center gap-2 flex-nowrap">
                                    <Button 
                                        onClick={()=>{navigate(`/kategorije/${kategorija.sifra}`)}}
                                    >
                                        <FaEdit />
                                    </Button>
                                    &nbsp;&nbsp;
                                    <Button 
                                        variant="danger" 
                                        onClick={()=>{obrisi(kategorija.sifra)}}
                                    >
                                        <FaTrash />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
        </>
    )
}