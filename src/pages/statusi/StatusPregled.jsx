import { useEffect, useState } from "react"
import { Button, Container, Table } from "react-bootstrap"
import { GrDislike, GrLike } from "react-icons/gr"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import StatusService from "../../services/statusi/StatusService"
import { FaEdit, FaTrash } from "react-icons/fa"

export default function StatusPregled(){

    const navigate = useNavigate()
    const[statusi, setStatusi] = useState([])

    useEffect(()=>{
        ucitajStatuse()
    },[])

    async function ucitajStatuse() {
        await StatusService.get().then((odgovor)=>{
            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }
            // console.log(odgovor.data)
            setStatusi(odgovor.data)
        })
    }

    async function obrisi(sifra) {
        if(!confirm('Sigurno obrisati')){
            return
        }
        await StatusService.obrisi(sifra)
        ucitajStatuse()
    }

    return(
        <>
            <Link to={RouteNames.STATUSI_NOVI} className="btn btn-success w-100 mb-3 mt-3">
                Dodavanje novi status
            </Link>
            <div className="table-responsive">
                <Table striped bordered hover className="align-middle"> 
                    <thead className="text-center">
                        <tr>
                            <th>Naziv</th>
                            <th>Opis</th>
                            <th>Akcija</th>
                        </tr>
                    </thead>
                    <tbody>
                        {statusi && statusi.map((status)=>(
                            <tr key={status.sifra}>
                                <td>{status.naziv}</td>
                                <td>{status.opis}</td>
                                <td className="text-center align-middle">
                                <div className="d-flex justify-content-center gap-2 flex-nowrap">
                                        <Button 
                                            onClick={()=>{navigate(`/statusi/${status.sifra}`)}}
                                        >
                                            <FaEdit />
                                        </Button>
                                        &nbsp;&nbsp;
                                        <Button 
                                            variant="danger" 
                                            onClick={()=>{obrisi(status.sifra)}}
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