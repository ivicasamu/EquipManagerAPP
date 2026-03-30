import { korisnici } from "./KorisnikPodaci"


async function get() {
    return {data: [...korisnici]}
}

async function getBySifra(sifra){
    return {data: korisnici.find(s => s.sifra === parseInt(sifra))}
}

async function dodaj(korisnik){
    if(korisnici.length > 0){
        korisnik.sifra = korisnici[korisnici.length - 1].sifra + 1
    } else {
        korisnik.sifra = 1
    }

    korisnici.push(korisnik)
}

async function promjeni(sifra, korisnik){
    const index = nadiIndex(sifra)
    korisnici[index] = {...korisnici[index], ...korisnik}
}

function nadiIndex(sifra){
    return korisnici.findIndex(s => s. sifra === parseInt(sifra))
}

async function obrisi(sifra) {
    const index = nadiIndex(sifra)
    korisnici.splice(index,1)
}

export default{
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi
}