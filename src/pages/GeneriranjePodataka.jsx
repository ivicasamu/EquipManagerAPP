import { useState } from 'react'
import { Button, Form, Alert, Container, Row, Col } from 'react-bootstrap'
import { en, en_US, Faker, hr } from '@faker-js/faker'
import KategorijaService from '../services/kategorije/KategorijaService'
import StatusService from '../services/statusi/StatusService'
import UredjajService from '../services/uredjaji/UredjajService'
import KlijentService from '../services/klijenti/KlijentService'
import KorisnikService from '../services/korisnici/KorisnikService'
import EventService from '../services/eventi/EventService'

export default function GeneriranjePodataka() {
    const [brojKorisnika, setBrojKorisnika] = useState(5)
    const [brojUredjaja, setBrojUredjaja] = useState(20)
    const [brojKlijenata, setBrojKlijenata] = useState(10)
    const [brojEvenata, setBrojEvenata] = useState(10)
    const [poruka, setPoruka] = useState(null)
    const [loading, setLoading] = useState(false)

    async function osigurajKategorijeIStatuse() {
        const rezultatKategorije = await KategorijaService.get()
        const rezultatStatusi = await StatusService.get()

        let kategorije = rezultatKategorije.data
        let statusi = rezultatStatusi.data

        // Ako nema kategorija → kreiraj
        if (!kategorije || kategorije.length === 0) {
            const defaultKategorije = [
                { sifra: 1, naziv: 'Projektor', aktivna: true },
                { sifra: 2, naziv: 'Leća', aktivna: true },
                { sifra: 3, naziv: 'Server', aktivna: true },
                { sifra: 4, naziv: 'Video server', aktivna: true },
                { sifra: 5, naziv: 'Računalo', aktivna: true },
                { sifra: 6, naziv: 'Procesor zvuka', aktivna: true },
            ]

            for (const k of defaultKategorije) {
                await KategorijaService.dodaj(k)
            }

            const res = await KategorijaService.get()
            kategorije = res.data
        }

        // Ako nema statusa → kreiraj
        if (!statusi || statusi.length === 0) {
            const defaultStatusi = [
                { sifra: 1, naziv: 'Dostupno', opis: 'Može se iznajmiti odmah' },
                { sifra: 2, naziv: 'Rezervirano', opis: 'Netko je napravio booking (ali još nije preuzeo)' },
                { sifra: 3, naziv: 'Iznajmljeno', opis: 'Trenutno kod korisnika' },
                { sifra: 4, naziv: 'U povratu / pregled', opis: 'Vraćeno, ali još nije provjereno' },
                { sifra: 5, naziv: 'U servisu', opis: 'Pokvareno ili na održavanju' },
                { sifra: 6, naziv: 'Neaktivno', opis: 'Nije u ponudi(staro, otpisno, blokirano' }
            ]

            for (const s of defaultStatusi) {
                await StatusService.dodaj(s)
            }

            const res = await StatusService.get()
            statusi = res.data
        }

        return { kategorije, statusi }
    }

  
    const faker = new Faker({
        locale: [hr, en, en_US]
    });

    const generirajKorisnike = async (broj) => {
        for (let i = 0; i < broj; i++) {
            const korisnik = {
                ime: i%2===0? faker.person.firstName('male') : faker.person.firstName('female'),
                prezime: faker.person.lastName(),
                korisnickoIme: faker.internet.username(),
                lozinka: faker.internet.password({length: 6, pattern: /[0-9]/}),
                email: faker.internet.email(),
                administrator: faker.datatype.boolean()
            };
            await KorisnikService.dodaj(korisnik);
        }
    };

    const generirajUredjaje = async (broj) => {

        const { kategorije, statusi } = await osigurajKategorijeIStatuse()

        const modeliOpreme = [
            'Epson PU2213',
            'Epson PU2008',
            'Epson PQ2216',
            'NEC PA803UL',
            'NECPX1004',
            'VIOSO Media 8',
            'VIOSO Pico',
            'Mac Studio M2 Max',
            'Mac Studio M3',
            'Mac mini M4'
        ]

        for (let i = 0; i < broj; i++) {
            // Odaberi nasumični smjer
            const randomKategorija = kategorije[faker.number.int({ min: 0, max: kategorije.length - 1 })]
            const randomStatus = statusi[faker.number.int({ min: 0, max: statusi.length - 1 })]
  
            const uredjaj = {
                kategorija: randomKategorija.sifra,
                model: modeliOpreme[i % modeliOpreme.length] + (i >= modeliOpreme.length ? ` ${Math.floor(i / modeliOpreme.length) + 1}` : ''),
                serijskiBroj: faker.string.alphanumeric(10),
                status: randomStatus.sifra,
                napomena: faker.lorem.sentence(2)
            };
            
            await UredjajService.dodaj(uredjaj)
        }
    }

    const generirajKlijente = async (broj) => {
        for (let i = 0; i < broj; i++) {
            const klijent = {
                naziv: faker.company.name() + ' d.o.o.',
                adresa: faker.location.street() + ' ' + faker.number.int({ min: 1, max: 200 }) + ', ' + faker.location.city(),
                oib: faker.string.numeric(11),
                kontaktOsoba: faker.person.firstName(i % 2 === 0 ? 'male' : 'female') + ' ' + faker.person.lastName(),
                tel: '09' + faker.string.numeric(8),
                email: faker.internet.email()
            }
            await KlijentService.dodaj(klijent)
        }
    }

    const generirajEvente = async (broj) => {
        const rezultat = await KlijentService.get()
        const klijenti = rezultat.data

        for (let i = 0; i < broj; i++) {
            const randomKlijent = klijenti[faker.number.int({ min: 0, max: klijenti.length - 1 })]
  
            const uredjaj = {
                datumPocetka: faker.date.soon().toISOString().split('T')[0],
                predvidenoTrajanje: faker.number.int({ min: 0, max: 30 }),
                lokacija: faker.location.city(),
                klijent: randomKlijent.sifra,
                napomena: faker.lorem.sentence(2)
            };
            
            await EventService.dodaj(uredjaj)
        }
    }

    const handleGenerirajUredjaje = async (e) => {
        e.preventDefault()
        setLoading(true)
        setPoruka(null)

        try {
            await generirajUredjaje(brojUredjaja);

            setPoruka({
                tip: 'success',
                tekst: `Uspješno generirano ${brojUredjaja} uređaja!`
            });
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri generiranju uređaja: ' + error.message
            });
        } finally {
            setLoading(false);
        }
    }

    const handleGenerirajKorisnike = async (e) => {
        e.preventDefault()
        setLoading(true)
        setPoruka(null)

        try {
            
            await generirajKorisnike(brojKorisnika)

            setPoruka({
                tip: 'success',
                tekst: `Uspješno generirano ${brojKorisnika} korisnika!`
            });
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri generiranju korisnika: ' + error.message
            });
        } finally {
            setLoading(false)
        }
    }

    const handleGenerirajKlijente = async (e) => {
        e.preventDefault()
        setLoading(true)
        setPoruka(null)

        try {
            
            await generirajKlijente(brojKlijenata)

            setPoruka({
                tip: 'success',
                tekst: `Uspješno generirano ${brojKlijenata} klijenata!`
            });
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri generiranju klijenata: ' + error.message
            });
        } finally {
            setLoading(false)
        }
    }

    const handleGenerirajEvente = async (e) => {
        e.preventDefault()
        setLoading(true)
        setPoruka(null)

        try {
            await generirajEvente(brojEvenata);

            setPoruka({
                tip: 'success',
                tekst: `Uspješno generirano ${brojEvenata} evenata!`
            });
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri generiranju evenata: ' + error.message
            });
        } finally {
            setLoading(false);
        }
    }

    const handleObrisiKorisnike = async () => {
        if (!window.confirm('Jeste li sigurni da želite obrisati sve korisnike?')) {
            return
        }

        setLoading(true)
        setPoruka(null)

        try {
            const rezultat = await KorisnikService.get();
            const korisnici = rezultat.data;
            
            for (const korisnik of korisnici) {
                await KorisnikService.obrisi(korisnik.sifra);
            }

            setPoruka({
                tip: 'success',
                tekst: `Uspješno obrisano ${korisnici.length} korisnika!`
            })
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri brisanju korisnika: ' + error.message
            })
        } finally {
            setLoading(false)
        }
    }

    const handleObrisiUredjaje = async () => {
        if (!window.confirm('Jeste li sigurni da želite obrisati sve uređaje?')) {
            return
        }

        setLoading(true);
        setPoruka(null);

        try {
            const rezultat = await UredjajService.get();
            const uredjaji = rezultat.data;
            
            for (const uredjaj of uredjaji) {
                await UredjajService.obrisi(uredjaj.sifra);
            }

            setPoruka({
                tip: 'success',
                tekst: `Uspješno obrisano ${uredjaji.length} uređaja!`
            });
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri brisanju uređaja: ' + error.message
            });
        } finally {
            setLoading(false)
        }
    }

    const handleObrisiKlijente = async () => {
        if (!window.confirm('Jeste li sigurni da želite obrisati sve klijente?')) {
            return;
        }

        setLoading(true)
        setPoruka(null)

        try {
            const rezultat = await KlijentService.get();
            const klijenti = rezultat.data
            
            for (const klijent of klijenti) {
                await KlijentService.obrisi(klijent.sifra);
            }

            setPoruka({
                tip: 'success',
                tekst: `Uspješno obrisano ${klijenti.length} klijenata!`
            });
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri brisanju klijenata: ' + error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const handleObrisiEvente = async () => {
        if (!window.confirm('Jeste li sigurni da želite obrisati sve evente?')) {
            return
        }

        setLoading(true);
        setPoruka(null);

        try {
            const rezultat = await EventService.get();
            const eventi = rezultat.data;
            
            for (const event of eventi) {
                await EventService.obrisi(event.sifra);
            }

            setPoruka({
                tip: 'success',
                tekst: `Uspješno obrisano ${eventi.length} evenata!`
            });
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri brisanju evenata: ' + error.message
            });
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container className="mt-4">
            <h1>Generiranje podataka</h1>
            <p className="text-muted">
                Koristite ovaj alat za generiranje testnih podataka s lažnim (fake) podacima na hrvatskom jeziku.
            </p>

            {poruka && (
                <Alert variant={poruka.tip} dismissible onClose={() => setPoruka(null)}>
                    {poruka.tekst}
                </Alert>
            )}

            <Row>
                <Col md={3}>
                    <Form onSubmit={handleGenerirajKorisnike}>
                        <Form.Group className="mb-3">
                            <Form.Label>Broj korisnika</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max="50"
                                value={brojKorisnika}
                                onChange={(e) => setBrojKorisnika(parseInt(e.target.value))}
                                disabled={loading}
                            />
                            <Form.Text className="text-muted">
                                Unesite broj korisnika (1-50)
                            </Form.Text>
                        </Form.Group>
                        <Button 
                            variant="primary" 
                            type="submit" 
                            disabled={loading}
                            className="w-100"
                        >
                            {loading ? 'Generiranje...' : 'Generiraj korisnika'}
                        </Button>
                    </Form>
                </Col>
                <Col md={3}>
                    <Form onSubmit={handleGenerirajKlijente}>
                        <Form.Group className="mb-3">
                            <Form.Label>Broj klijenata</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max="200"
                                value={brojKlijenata}
                                onChange={(e) => setBrojKlijenata(parseInt(e.target.value))}
                                disabled={loading}
                            />
                            <Form.Text className="text-muted">
                                Unesite broj klijenata (1-200)
                            </Form.Text>
                        </Form.Group>
                        <Button 
                            variant="primary" 
                            type="submit" 
                            disabled={loading}
                            className="w-100"
                        >
                            {loading ? 'Generiranje...' : 'Generiraj klijenata'}
                        </Button>
                    </Form>
                </Col>
                <Col md={3}>
                    <Form onSubmit={handleGenerirajUredjaje}>
                        <Form.Group className="mb-3">
                            <Form.Label>Broj uređaja</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max="100"
                                value={brojUredjaja}
                                onChange={(e) => setBrojUredjaja(parseInt(e.target.value))}
                                disabled={loading}
                            />
                            <Form.Text className="text-muted">
                                Unesite broj uređaja (1-100)
                            </Form.Text>
                        </Form.Group>
                        <Button 
                            variant="primary" 
                            type="submit" 
                            disabled={loading}
                            className="w-100"
                        >
                            {loading ? 'Generiranje...' : 'Generiraj uređaje'}
                        </Button>
                    </Form>
                </Col>
                <Col md={3}>
                    <Form onSubmit={handleGenerirajEvente}>
                        <Form.Group className="mb-3">
                            <Form.Label>Broj evenata</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max="100"
                                value={brojEvenata}
                                onChange={(e) => setBrojEvenata(parseInt(e.target.value))}
                                disabled={loading}
                            />
                            <Form.Text className="text-muted">
                                Unesite broj evenata (1-100)
                            </Form.Text>
                        </Form.Group>
                        <Button 
                            variant="primary" 
                            type="submit" 
                            disabled={loading}
                            className="w-100"
                        >
                            {loading ? 'Generiranje...' : 'Generiraj evenata'}
                        </Button>
                    </Form>
                </Col>
            </Row>

            <Alert variant="warning" className="mt-3">
                <strong>Upozorenje:</strong> Ove akcije će dodati nove podatke u postojeće. 
                Ako želite početi ispočetka, prvo obrišite postojeće podatke.
            </Alert>

            <hr className="my-4" />

            <h3>Brisanje podataka</h3>
            <p className="text-muted">
                Koristite ove opcije za brisanje svih podataka iz baze.
            </p>

            <Row className="mt-3">
                <Col md={3}>
                    <Button 
                        variant="danger" 
                        onClick={handleObrisiKorisnike}
                        disabled={loading}
                        className="w-100 mb-2"
                    >
                        {loading ? 'Brisanje...' : 'Obriši sve korisnike'}
                    </Button>
                </Col>
                <Col md={3}>
                    <Button 
                        variant="danger" 
                        onClick={handleObrisiKlijente}
                        disabled={loading}
                        className="w-100 mb-2"
                    >
                        {loading ? 'Brisanje...' : 'Obriši sve klijente'}
                    </Button>
                </Col>
                <Col md={3}>
                    <Button 
                        variant="danger" 
                        onClick={handleObrisiUredjaje}
                        disabled={loading}
                        className="w-100 mb-2"
                    >
                        {loading ? 'Brisanje...' : 'Obriši sve uređaje'}
                    </Button>
                </Col>
                <Col md={3}>
                    <Button 
                        variant="danger" 
                        onClick={handleObrisiEvente}
                        disabled={loading}
                        className="w-100 mb-2"
                    >
                        {loading ? 'Brisanje...' : 'Obriši sve evente'}
                    </Button>
                </Col>
            </Row>

            <Alert variant="danger" className="mt-3">
                <strong>Oprez!</strong> Brisanje podataka je trajna akcija i ne može se poništiti.
            </Alert>
        </Container>
    );
}
