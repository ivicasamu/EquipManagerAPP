import { korisnici } from "./KorisnikPodaci"
import bcrypt from 'bcryptjs'


// 1/4 Read od CRUD
async function get(){
    // Ne vraćamo lozinke u listi
    const korisniciBezcLozinki = korisnici.map(op => ({
        sifra: op.sifra,
        ime: op.ime,
        prezime: op.prezime,
        email: op.email,
        korisnickoIme: op.korisnickoIme,
        administrator: op.administrator
    }))
    return {success: true, data: [...korisniciBezcLozinki]}
}

async function getBySifra(sifra) {
    const korisnik = korisnici.find(o => o.sifra === sifra)
    
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

// 2/4 Create od CRUD
async function dodaj(korisnik) {
    if (korisnici.length === 0) {
        korisnik.sifra = '1'
    } else {
        korisnik.sifra = String(parseInt(korisnici[korisnici.length - 1].sifra) + 1)
    }
    
    // Hashiraj lozinku prije spremanja
    korisnik.lozinka = bcrypt.hashSync(korisnik.lozinka, 10)
    
    korisnici.push(korisnik)
  
    return {success: true, data: {
        sifra: korisnik.sifra,
        ime: korisnik.ime,
        prezime: korisnik.prezime,
        email: korisnik.email,
        korisnickoIme: korisnik.korisnickoIme,
        administrator: korisnik.administrator
    }}
}

// 3/4 Update od CRUD
async function promjeni(sifra, korisnik) {
    const index = nadiIndex(sifra)
    
    if (index === -1) {
        return {success: false, message: "Korisnik nije pronađen"}
    }
    
    // Ažuriraj email i ulogu, ne lozinku
    korisnici[index] = {
        ...korisnici[index],
        ime: korisnik.ime,
        prezime: korisnik.prezime,
        email: korisnik.email,
        korisnickoIme: korisnik.korisnickoIme,
        administrator: korisnik.administrator,
        sifra: sifra
    }

    return {success: true, data: {
        ime: korisnik[index].ime,
        prezime: korisnik[index].prezime,
        email: korisnik[index].email,
        korisnickoIme: korisnik[index].korisnickoIme,
        administrator: korisnik[index].administrator
    }}
}

async function promjeniLozinku(sifra, novaLozinka) {
    const index = nadiIndex(sifra)
    
    if (index === -1) {
        return {success: false, message: "Korisnik nije pronađen"}
    }
    
    // Hashiraj novu lozinku
    korisnici[index].lozinka = bcrypt.hashSync(novaLozinka, 10)
    
    return {success: true, message: "Lozinka uspješno promijenjena"}
}

function nadiIndex(sifra){
    return korisnici.findIndex(s=>s.sifra === sifra)
}

// 4/4 Delete od CRUD
async function obrisi(sifra) {
    const index = nadiIndex(sifra);
    if (index > -1) {
        korisnici.splice(index, 1);
    }
    return;
}

async function prijava(korisnickoIme, lozinka) {
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


export default{
    get,
    dodaj,
    getBySifra,
    promjeni,
    promjeniLozinku,
    obrisi, 
    prijava
}