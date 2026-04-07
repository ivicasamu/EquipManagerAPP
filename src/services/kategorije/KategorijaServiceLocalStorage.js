const STORAGE_KEY = 'kategorije';

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(STORAGE_KEY);
    return podaci ? JSON.parse(podaci) : [];
}

function spremiUStorage(podaci) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci));
}

async function get() {
    const kategorije = dohvatiSveIzStorage();
    return {success: true,  data: [...kategorije] };
}

async function getBySifra(sifra) {
    const kategorije = dohvatiSveIzStorage();
    const kategorija = kategorije.find(s => s.sifra === parseInt(sifra));
    return {success: true,  data: kategorija };
}

async function dodaj(kategorija) {
    const kategorije = dohvatiSveIzStorage();
    
    if (kategorije.length === 0) {
        kategorija.sifra = 1;
    } else {
        const maxSifra = Math.max(...kategorije.map(s => s.sifra));
        kategorija.sifra = maxSifra + 1;
    }
    
    kategorije.push(kategorija);
    spremiUStorage(kategorije);
    return { data: kategorija };
}

async function promjeni(sifra, kategorija) {
    const kategorije = dohvatiSveIzStorage();
    const index = kategorije.findIndex(s => s.sifra === parseInt(sifra));
    
    if (index !== -1) {
        kategorije[index] = { ...kategorije[index], ...kategorija};
        spremiUStorage(kategorije);
    }
    return { data: kategorije[index] };
}

async function obrisi(sifra) {
    let kategorije = dohvatiSveIzStorage();
    kategorije = kategorije.filter(s => s.sifra !== parseInt(sifra));
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
