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

    const maxSifra = Math.max(0, ...klijenti.map(k => k.sifra || 0));
    klijent.sifra = maxSifra + 1;

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

// Straničenje - dohvati stranicu polaznika
async function getPage(page = 1, pageSize = 10) {
    const klijenti = dohvatiSveIzStorage();
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = klijenti.slice(startIndex, endIndex);
    const totalItems = klijenti.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
        success: true,
        data: paginatedData,
        currentPage: page,
        pageSize: pageSize,
        totalPages: totalPages,
        totalItems: totalItems
    };
}

export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi,
    getPage
};
