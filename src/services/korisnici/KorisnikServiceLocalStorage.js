import bcrypt from 'bcryptjs'
import { PrefixStorage } from "../../constants"

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(PrefixStorage.KORISNICI)
    return podaci ? JSON.parse(podaci) : [];
}

function spremiUStorage(podaci) {
    localStorage.setItem(PrefixStorage.KORISNICI, JSON.stringify(podaci));
}

async function get() {
    const korisnici = dohvatiSveIzStorage()

    const korisniciBezLozinki = korisnici.map(k => ({
        sifra: k.sifra,
        ime: k.ime,
        prezime: k.prezime,
        email: k.email,
        korisnickoIme: k.korisnickoIme,
        administrator: k.administrator
    }))

    return {
        success: true,
        data: korisniciBezLozinki
    }
}

async function getBySifra(sifra) {
    const korisnici = dohvatiSveIzStorage();
    const korisnik = korisnici.find(s => s.sifra === parseInt(sifra));
    
    if (!korisnik) {
        return {success: false, data: null}
    }

    return {success: true,  data: {
        sifra: korisnik.sifra,
        ime: korisnik.ime,
        prezime: korisnik.prezime,
        email: korisnik.email,
        korisnickoIme: korisnik.korisnickoIme,
        administrator: korisnik.administrator
    } }
}

async function dodaj(korisnik) {
    const korisnici = dohvatiSveIzStorage();

    if (korisnici.length === 0) {
        korisnik.sifra = 1
    } else {
        // Pronalaženje najveće šifre da izbjegnemo duplikate
        const maxSifra = Math.max(...korisnici.map(o => o.sifra))
        korisnik.sifra = maxSifra + 1
    }
    
    // Hashiraj lozinku prije spremanja
    korisnik.lozinka = bcrypt.hashSync(korisnik.lozinka, 10)
    
    korisnici.push(korisnik)
    spremiUStorage(korisnici)
    return {success: true, data: {
        sifra: korisnik.sifra,
        ime: korisnik.ime,
        prezime: korisnik.prezime,
        email: korisnik.email,
        administrator: korisnik.administrator
    }}
}

async function promjeni(sifra, korisnik) {
    const korisnici = dohvatiSveIzStorage()
    const index = korisnici.findIndex(o => o.sifra === parseInt(sifra))
    
    if (index === -1) {
        return {success: false, message: "Korisnik nije pronađen"}
    }
    
    // Ažuriraj email i ulogu, ne lozinku
    korisnici[index] = {
        ...korisnici[index],
        ime: korisnik.ime,
        prezime: korisnik.prezime,
        email: korisnik.email,
        administrator: korisnik.administrator,
        sifra: parseInt(sifra)
    }
    spremiUStorage(korisnici)
    return {success: true, data: {
        ime: korisnici[index].ime,
        prezime: korisnici[index].prezime,
        email: korisnici[index].email,
        administrator: korisnici[index].administrator
    }}
}


async function promjeniLozinku(sifra, novaLozinka) {
    const korisnici = dohvatiSveIzStorage()
    const index = korisnici.findIndex(o => o.sifra === parseInt(sifra))
    
    if (index === -1) {
        return {success: false, message: "Korisnik nije pronađen"}
    }
    
    // Hashiraj novu lozinku
    korisnici[index].lozinka = bcrypt.hashSync(novaLozinka, 10)
    spremiUStorage(korisnici)
    
    return {success: true, message: "Lozinka uspješno promijenjena"}
}

async function prijava(korisnickoIme, lozinka) {
    const korisnici = dohvatiSveIzStorage()
    const korisnik = korisnici.find(o => o.korisnickoIme === korisnickoIme)
    if (!korisnik) {
        return {success: false, message: "Email i lozinka ne odgovaraju"} // iako bi ovdje mogli napisati i da email ne postoji ali to onda napadačima omogućuje da zna tko je a tko nije registriran
    }
    
    // Provjeri lozinku pomoću bcrypt
    const isMatch = bcrypt.compareSync(lozinka, korisnik.lozinka)
    if (!isMatch) {
        return {success: false, message: "Email i lozinka ne odgovaraju"}
    }
    
    // Vrati korisnika bez lozinke
    return {
        success: true, 
        data: {
            sifra: korisnik.sifra,
            ime: korisnik.ime,
            prezime: korisnik.prezime,
            email: korisnik.email,
            korisnickoIme: korisnik.korisnickoIme,
            administrator: korisnik.administrator
        }
    }
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
    obrisi,
    prijava
};
