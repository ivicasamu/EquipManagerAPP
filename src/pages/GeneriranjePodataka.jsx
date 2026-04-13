import { useState } from 'react';
import { Button, Form, Alert, Container, Row, Col } from 'react-bootstrap';
import { Faker, hr } from '@faker-js/faker';
import KategorijaService from '../services/kategorije/KategorijaService';



export default function GeneriranjePodataka() {
    const [brojKorisnika, setBrojKorisnika] = useState(5);
    const [brojUredjaja, setBrojUredjaja] = useState(20);
    // const [brojKlijenata, setBrojKlijenata] = useState(10);
    const [poruka, setPoruka] = useState(null);
    const [loading, setLoading] = useState(false);

    // Postavi faker na hrvatski jezik
    const faker = new Faker({
        locale: [hr]
    });

    const generirajKorisnike = async (broj) => {
        for (let i = 0; i < broj; i++) {
            const korisnik = {
                ime: i%2===0? faker.person.firstName('male') : faker.person.firstName('female'),
                prezime: faker.person.lastName(),
                korisnickoIme: faker.internet.username(),
                lozinka: faker.internet.password({length: 6, pattern: /[0-9]/}),
                email: faker.internet.email(),
                administrator: faker.internet.boolean()
            };
            await KategorijaService.dodaj(korisnik);
        }
    };

    const generirajUredjaje = async (broj) => {
        const nazivi = [
            'Web programiranje',
            'Java programiranje',
            'Python programiranje',
            'Frontend razvoj',
            'Backend razvoj',
            'Full Stack razvoj',
            'Mobile razvoj',
            'DevOps',
            'Data Science',
            'Cyber Security',
            'UI/UX dizajn',
            'Digital Marketing',
            'Grafički dizajn',
            'Video produkcija',
            'Fotografija'
        ];

        for (let i = 0; i < broj; i++) {
            await SmjerService.dodaj({
                naziv: naziviSmjerova[i % naziviSmjerova.length] + (i >= naziviSmjerova.length ? ` ${Math.floor(i / naziviSmjerova.length) + 1}` : ''),
                trajanje: faker.number.int({ min: 130, max: 350 }),
                cijena: faker.number.float({ min: 1100, max: 5000, precision: 0.01 }).toFixed(2),
                datumPokretanja: faker.date.soon().toISOString().split('T')[0],
                aktivan: faker.datatype.boolean()
            });
        }
    };

    const generirajPolaznike = async (broj) => {
        for (let i = 0; i < broj; i++) {
            const polaznik = {
                ime: i%2===0? faker.person.firstName('male') : faker.person.firstName('female'),
                prezime: faker.person.lastName(),
                email: faker.internet.email(),
                oib: faker.string.numeric(11)
            };
            await PolaznikService.dodaj(polaznik);
        }
    };

    const generirajGrupe = async (broj) => {

        // Dohvati sve smjerove
        const rezultatSmjerovi = await SmjerService.get();
        const smjerovi = rezultatSmjerovi.data;

        
        if (smjerovi.length === 0) {
            throw new Error('Nema dostupnih smjerova. Prvo generirajte smjerove.');
        }
        
        for (let i = 0; i < broj; i++) {
            // Odaberi nasumični smjer
            const randomSmjer = smjerovi[faker.number.int({ min: 0, max: smjerovi.length - 1 })];
  
            const grupa = {
                naziv: randomSmjer.naziv.trim().split(/\s+/).slice(0, 2).map(rijec => rijec[0]).join('').toUpperCase(),   
                smjer: randomSmjer.sifra
            };
            
            await GrupaService.dodaj(grupa);
        }
    };

    const handleGenerirajSmjerove = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPoruka(null);

        try {
            await generirajSmjerove(brojSmjerova);

            setPoruka({
                tip: 'success',
                tekst: `Uspješno generirano ${brojSmjerova} smjerova!`
            });
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri generiranju smjerova: ' + error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGenerirajPolaznike = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPoruka(null);

        try {
            
            await generirajPolaznike(brojPolaznika);

            setPoruka({
                tip: 'success',
                tekst: `Uspješno generirano ${brojPolaznika} polaznika!`
            });
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri generiranju polaznika: ' + error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const handleObrisiPolaznike = async () => {
        if (!window.confirm('Jeste li sigurni da želite obrisati sve polaznike?')) {
            return;
        }

        setLoading(true);
        setPoruka(null);

        try {
            const rezultat = await PolaznikService.get();
            const polaznici = rezultat.data;
            
            for (const polaznik of polaznici) {
                await PolaznikService.obrisi(polaznik.sifra);
            }

            setPoruka({
                tip: 'success',
                tekst: `Uspješno obrisano ${polaznici.length} polaznika!`
            });
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri brisanju polaznika: ' + error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const handleObrisiSmjerove = async () => {
        if (!window.confirm('Jeste li sigurni da želite obrisati sve smjerove?')) {
            return;
        }

        setLoading(true);
        setPoruka(null);

        try {
            const rezultat = await SmjerService.get();
            const smjerovi = rezultat.data;
            
            for (const smjer of smjerovi) {
                await SmjerService.obrisi(smjer.sifra);
            }

            setPoruka({
                tip: 'success',
                tekst: `Uspješno obrisano ${smjerovi.length} smjerova!`
            });
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri brisanju smjerova: ' + error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGenerirajGrupe = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPoruka(null);

        try {
            await generirajGrupe(brojGrupa);

            setPoruka({
                tip: 'success',
                tekst: `Uspješno generirano ${brojGrupa} grupa!`
            });
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri generiranju grupa: ' + error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const handleObrisiGrupe = async () => {
        if (!window.confirm('Jeste li sigurni da želite obrisati sve grupe?')) {
            return;
        }

        setLoading(true);
        setPoruka(null);

        try {
            const rezultat = await GrupaService.get();
            const grupe = rezultat.data;
            
            for (const grupa of grupe) {
                await GrupaService.obrisi(grupa.sifra);
            }

            setPoruka({
                tip: 'success',
                tekst: `Uspješno obrisano ${grupe.length} grupa!`
            });
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri brisanju grupa: ' + error.message
            });
        } finally {
            setLoading(false);
        }
    };

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
                <Col md={4}>
                    <Form onSubmit={handleGenerirajSmjerove}>
                        <Form.Group className="mb-3">
                            <Form.Label>Broj smjerova</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max="50"
                                value={brojSmjerova}
                                onChange={(e) => setBrojSmjerova(parseInt(e.target.value))}
                                disabled={loading}
                            />
                            <Form.Text className="text-muted">
                                Unesite broj smjerova (1-50)
                            </Form.Text>
                        </Form.Group>
                        <Button 
                            variant="primary" 
                            type="submit" 
                            disabled={loading}
                            className="w-100"
                        >
                            {loading ? 'Generiranje...' : 'Generiraj smjerove'}
                        </Button>
                    </Form>
                </Col>
                <Col md={4}>
                    <Form onSubmit={handleGenerirajPolaznike}>
                        <Form.Group className="mb-3">
                            <Form.Label>Broj polaznika</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max="200"
                                value={brojPolaznika}
                                onChange={(e) => setBrojPolaznika(parseInt(e.target.value))}
                                disabled={loading}
                            />
                            <Form.Text className="text-muted">
                                Unesite broj polaznika (1-200)
                            </Form.Text>
                        </Form.Group>
                        <Button 
                            variant="primary" 
                            type="submit" 
                            disabled={loading}
                            className="w-100"
                        >
                            {loading ? 'Generiranje...' : 'Generiraj polaznike'}
                        </Button>
                    </Form>
                </Col>
                <Col md={4}>
                    <Form onSubmit={handleGenerirajGrupe}>
                        <Form.Group className="mb-3">
                            <Form.Label>Broj grupa</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max="100"
                                value={brojGrupa}
                                onChange={(e) => setBrojGrupa(parseInt(e.target.value))}
                                disabled={loading}
                            />
                            <Form.Text className="text-muted">
                                Unesite broj grupa (1-100)
                            </Form.Text>
                        </Form.Group>
                        <Button 
                            variant="primary" 
                            type="submit" 
                            disabled={loading}
                            className="w-100"
                        >
                            {loading ? 'Generiranje...' : 'Generiraj grupe'}
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
                <Col md={4}>
                    <Button 
                        variant="danger" 
                        onClick={handleObrisiSmjerove}
                        disabled={loading}
                        className="w-100 mb-2"
                    >
                        {loading ? 'Brisanje...' : 'Obriši sve smjerove'}
                    </Button>
                </Col>
                <Col md={4}>
                    <Button 
                        variant="danger" 
                        onClick={handleObrisiPolaznike}
                        disabled={loading}
                        className="w-100 mb-2"
                    >
                        {loading ? 'Brisanje...' : 'Obriši sve polaznike'}
                    </Button>
                </Col>
                <Col md={4}>
                    <Button 
                        variant="danger" 
                        onClick={handleObrisiGrupe}
                        disabled={loading}
                        className="w-100 mb-2"
                    >
                        {loading ? 'Brisanje...' : 'Obriši sve grupe'}
                    </Button>
                </Col>
            </Row>

            <Alert variant="danger" className="mt-3">
                <strong>Oprez!</strong> Brisanje podataka je trajna akcija i ne može se poništiti.
            </Alert>
        </Container>
    );
}
