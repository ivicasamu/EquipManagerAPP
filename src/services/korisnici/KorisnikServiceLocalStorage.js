import { PrefixStorage } from "../../constants"

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(PrefixStorage.KORISNICI)
    return podaci ? JSON.parse(podaci) : [];
}

function spremiUStorage(podaci) {
    localStorage.setItem(PrefixStorage.KORISNICI, JSON.stringify(podaci));
}

async function get() {
    const korisnici = dohvatiSveIzStorage();
    return {success: true,  data: [...korisnici] };
}

async function getBySifra(sifra) {
    const korisnici = dohvatiSveIzStorage();
    const korisnik = korisnici.find(s => s.sifra === parseInt(sifra));
    return {success: true,  data: korisnik };
}

async function dodaj(korisnik) {
    const korisnici = dohvatiSveIzStorage();

    const maxSifra = Math.max(0, ...korisnici.map(k => k.sifra || 0));
    korisnik.sifra = maxSifra + 1;

    korisnici.push(korisnik);
    spremiUStorage(korisnici);

    return { data: korisnik };
}

async function promjeni(sifra, korisnik) {
    const korisnici = dohvatiSveIzStorage();
    const index = korisnici.findIndex(s => s.sifra === parseInt(sifra));
    
    if (index !== -1) {
        korisnici[index] = { ...korisnici[index], ...korisnik};
        spremiUStorage(korisnici);
    }
    return { data: korisnici[index] };
}

async function obrisi(sifra) {
    let korisnici = dohvatiSveIzStorage();
    korisnici = korisnici.filter(s => s.sifra !== parseInt(sifra));
    spremiUStorage(korisnici);
    return { message: 'Obrisano' };
}

export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi
};
