import { PrefixStorage } from "../../constants";

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(PrefixStorage.KATEGORIJE)
    return podaci ? JSON.parse(podaci) : []
}

function spremiUStorage(podaci) {
    localStorage.setItem(PrefixStorage.KATEGORIJE, JSON.stringify(podaci));
}

async function get() {
    const kategorije = dohvatiSveIzStorage()
    return {success: true,  data: [...kategorije] }
}

async function getBySifra(sifra) {
    const kategorije = dohvatiSveIzStorage()
    const kategorija = kategorije.find(s => s.sifra === sifra)
    return {success: true,  data: kategorija }
}

async function dodaj(kategorija) {
    const kategorije = dohvatiSveIzStorage()
    
    if (kategorije.length === 0) {
        kategorija.sifra = '1'
    } else {
        kategorija.sifra = String(parseInt(kategorije[kategorije.length - 1].sifra) + 1)
    }
    
    kategorije.push(kategorija)
    spremiUStorage(kategorije)
    return { data: kategorija }
}

async function promjeni(sifra, kategorija) {
    const kategorije = dohvatiSveIzStorage();
    const index = kategorije.findIndex(s => s.sifra === sifra)
    
    if (index !== -1) {
        kategorije[index] = { ...kategorije[index], ...kategorija};
        spremiUStorage(kategorije);
    }
    return { data: kategorije[index] };
}

async function obrisi(sifra) {
    let kategorije = dohvatiSveIzStorage();
    kategorije = kategorije.filter(s => s.sifra !== sifra)
    spremiUStorage(kategorije);
    return { message: 'Obrisano' };
}

export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi
};
