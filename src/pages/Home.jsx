import { Card, Col, Row } from "react-bootstrap"
import { IME_APLIKACIJE } from "../constants"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import KorisnikService from "../services/korisnici/KorisnikService";
import UredjajService from "../services/uredjaji/UredjajService";
import { useEffect, useState } from "react";
import KlijentService from "../services/klijenti/KlijentService";

export default function Home(){
    const [brojKorisnika, setBrojKorisnika] = useState(0);
    const [brojUredjaja, setBrojUredjaja] = useState(0);
    const [brojKlijenata, setBrojKlijenata] = useState(0);
    // const [brojEventa, setBrojEventa] = useState(0);
    const [animatedKorisnici, setAnimatedKorisnici] = useState(0);
    const [animatedUredjaji, setAnimatedUredjaji] = useState(0);
    const [animatedKlijenti, setAnimatedKlijenti] = useState(0);
    // const [animatedEventi, setAnimatedEventi] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const korisnik = await KorisnikService.get();
                const uredjaj = await UredjajService.get();
                const klijent = await KlijentService.get();
                // const event = await EventService.get();
                
                setBrojKorisnika(korisnik.data.length);
                setBrojUredjaja(uredjaj.data.length);
                setBrojKlijenata(klijent.data.length);
                // setBrojEvenata(eventi.data.length);
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

    // useEffect(() => {
    //     if (animatedEventi < brojEvenata) {
    //         const timer = setTimeout(() => {
    //             setAnimatedEventi(prev => Math.min(prev + 1, brojEvenata));
    //         }, 200);
    //         return () => clearTimeout(timer);
    //     }
    // }, [animatedEventi, brojEvenata]);
    return(
        <>
        <Row>
            <Col md={6}>
                <h1>Dobro došli na {IME_APLIKACIJE}</h1>

                <div style={{maxWidth: '800px', margin: 'auto', padding: '100px'}}>
                    <DotLottieReact
                        src="/Animacija.lottie" loop autoplay
                    />
                </div>
            </Col>
            <Col className="d-flex align-items-center justify-content-center">
                <div style={{ width: '100%', maxWidth: '400px' }}>
                    <Card className="mb-3 shadow-lg border-0 statistikaPanel">
                        <Card.Body className="text-center">
                            <p className="text-white">Korisnici</p>
                            <div className="statistikaTekst">
                                {animatedKorisnici}
                            </div>
                        </Card.Body>
                    </Card>

                    <Card className="mb-3 shadow-lg border-0 statistikaPanel">
                        <Card.Body className="text-center">
                            <p className="text-white">Klijenti</p>
                            <div className="statistikaTekst">
                                {animatedKlijenti}
                            </div>
                        </Card.Body>
                    </Card>

                    <Card className="mb-3 shadow-lg border-0 statistikaPanel">
                        <Card.Body className="text-center">
                            <p className="text-white">Uređaji</p>
                            <div className="statistikaTekst">
                                {animatedUredjaji}
                            </div>
                        </Card.Body>
                    </Card>

                    {/* <Card className="shadow-lg border-0 statistikaPanel">
                        <Card.Body className="text-center">
                            <p className="text-white">Grupe</p>
                            <div className="statistikaTekst">
                                {animatedGrupe}
                            </div>
                        </Card.Body>
                    </Card> */}
                </div>
            </Col>
        </Row>
        
        </>
    )
}