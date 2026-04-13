const STORAGE_KEY = 'klijenti';

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(STORAGE_KEY);
    return podaci ? JSON.parse(podaci) : [];
}

function spremiUStorage(podaci) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci));
}

async function get() {
    const klijenti = dohvatiSveIzStorage();
    return {success: true,  data: [...klijenti] };
}

async function getBySifra(sifra) {
    const klijenti = dohvatiSveIzStorage();
    const klijent = klijenti.find(s => s.sifra === parseInt(sifra));
    return {success: true,  data: klijent };
}

async function dodaj(klijent) {
    const klijenti = dohvatiSveIzStorage();
    
    if (klijenti.length === 0) {
        klijent.sifra = 1;
    } else {
        const maxSifra = Math.max(...klijenti.map(s => s.sifra));
        klijent.sifra = maxSifra + 1;
    }
    
    klijenti.push(klijent);
    spremiUStorage(klijenti);
    return { data: klijent };
}

async function promjeni(sifra, klijent) {
    const klijenti = dohvatiSveIzStorage();
    const index = klijenti.findIndex(s => s.sifra === parseInt(sifra));
    
    if (index !== -1) {
        klijenti[index] = { ...klijenti[index], ...klijent};
        spremiUStorage(klijenti);
    }
    return { data: klijenti[index] };
}

async function obrisi(sifra) {
    let klijenti = dohvatiSveIzStorage();
    klijenti = klijenti.filter(s => s.sifra !== parseInt(sifra));
    spremiUStorage(klijenti);
    return { message: 'Obrisano' };
}

export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi
};
