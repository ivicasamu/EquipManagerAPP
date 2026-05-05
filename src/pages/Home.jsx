import { Card, Col, Row } from "react-bootstrap"
import { IME_APLIKACIJE } from "../constants"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import KorisnikService from "../services/korisnici/KorisnikService"
import UredjajService from "../services/uredjaji/UredjajService"
import { useEffect, useState } from "react"
import KlijentService from "../services/klijenti/KlijentService"
import EventService from "../services/eventi/EventService"

export default function Home(){
    const [brojKorisnika, setBrojKorisnika] = useState(0)
    const [brojAdmina, setBrojAdmina] = useState(0)
    const [brojStandardUsera, setBrojStandardUsera] = useState(0);
    const [brojUredjaja, setBrojUredjaja] = useState(0)
    const [brojKlijenata, setBrojKlijenata] = useState(0)
    const [brojEvenata, setBrojEvenata] = useState(0)
    const [animatedKorisnici, setAnimatedKorisnici] = useState(0)
    const [animatedUredjaji, setAnimatedUredjaji] = useState(0)
    const [animatedKlijenti, setAnimatedKlijenti] = useState(0)
    const [animatedEventi, setAnimatedEventi] = useState(0)

    useEffect(()=>{document.title='Početna, ' + IME_APLIKACIJE})

    useEffect(() => {
        const fetchData = async () => {
            try {
                const korisnici = await KorisnikService.get()
                const uredjaj = await UredjajService.get()
                const klijent = await KlijentService.get()
                const event = await EventService.get()
                
                setBrojKorisnika(korisnici.data.length)
                setBrojUredjaja(uredjaj.data.length)
                setBrojKlijenata(klijent.data.length)
                setBrojEvenata(event.data.length)

                const admini = korisnici.data.filter(op => op.administrator === true).length;
                const standarUser = korisnici.data.filter(op => op.administrator === false).length;
                setBrojAdmina(admini);
                setBrojStandardUsera(standarUser);
            } catch (error) {
                console.error('Greška pri dohvaćanju podataka:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (animatedKorisnici < brojKorisnika) {
            const timer = setTimeout(() => {
                setAnimatedKorisnici(prev => Math.min(prev + 1, brojKorisnika));
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [animatedKorisnici, brojKorisnika]);

    useEffect(() => {
        if (animatedUredjaji < brojUredjaja) {
            const timer = setTimeout(() => {
                setAnimatedUredjaji(prev => Math.min(prev + 1, brojUredjaja));
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [animatedUredjaji, brojUredjaja]);

    useEffect(() => {
        if (animatedKlijenti < brojUredjaja) {
            const timer = setTimeout(() => {
                setAnimatedKlijenti(prev => Math.min(prev + 1, brojKlijenata));
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [animatedKlijenti, brojKlijenata]);

    useEffect(() => {
        if (animatedEventi < brojEvenata) {
            const timer = setTimeout(() => {
                setAnimatedEventi(prev => Math.min(prev + 1, brojEvenata));
                }, 20);
            return () => clearTimeout(timer);
        }
    }, [animatedEventi, brojEvenata]);
    return(
        <>
        <Row>
            <Col md={6}>
                <h1>Dobro došli na {IME_APLIKACIJE}</h1>

                <div style={{maxWidth: '800px', margin: 'auto', padding: '100px'}}>
                    <DotLottieReact
                        src='/Animacija.lottie' loop autoplay
                    />
                </div>
            </Col>
            <Col className="d-flex align-items-center justify-content-center">
                <div style={{ width: '100%', maxWidth: '500px' }}>
                    <Row>
                        <Col md={6} className="mb-3">
                            <Card className="shadow-lg border-0 statistikaPanel h-100">
                                <Card.Body className="text-center">
                                    <p className="text-white">Klijenti</p>
                                    <div className="statistikaTekst">
                                        {animatedKlijenti}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6} className="mb-3">
                            <Card className="shadow-lg border-0 statistikaPanel h-100">
                                <Card.Body className="text-center">
                                    <p className="text-white">Uređaji</p>
                                    <div className="statistikaTekst">
                                        {animatedUredjaji}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} className="mb-3">
                            <Card className="shadow-lg border-0 statistikaPanel h-100">
                                <Card.Body className="text-center">
                                    <p className="text-white">Eventi</p>
                                    <div className="statistikaTekst">
                                        {animatedEventi}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6} className="mb-3">
                            <Card className="shadow-lg border-0 statistikaPanel h-100">
                                <Card.Body className="text-center">
                                    <p className="text-white">Operateri</p>
                                    <div className="statistikaTekst">
                                        {animatedKorisnici}
                                    </div>
                                    <div style={{ fontSize: '0.9rem', marginTop: '10px' }}>
                                        <span className="badge bg-danger me-2">Admin: {brojAdmina}</span>
                                        <span className="badge bg-primary">Korisnik: {brojStandardUsera}</span>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Col>
        </Row>
        
        </>
    )
}